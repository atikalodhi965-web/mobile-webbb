const mongoose = require('mongoose');
const Store = require('../models/Store');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');

const getSingleStore = async ({ requireActive = false } = {}) => {
  const query = {};
  if (requireActive) query.isActive = true;

  let store = await Store.findOne({ ...query, key: 'primary' });
  if (!store) {
    store = await Store.findOne(query).sort({ createdAt: 1 });
    if (store && store.key !== 'primary') {
      store.key = 'primary';
      try {
        await store.save();
      } catch {
        // Unique key already held by another document — keep the found store.
      }
    }
  }
  return store;
};

const requireSingleStore = async (options = {}) => {
  const store = await getSingleStore(options);
  if (!store) {
    throw new ApiError(404, 'Service centre is not configured.');
  }
  return store;
};

const startOfDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const getAvailableSlots = async (dateValue, storeDoc) => {
  const store = storeDoc || (await requireSingleStore({ requireActive: true }));

  if (!store.availableForBooking || !store.isActive) {
    return {
      storeId: store._id,
      date: dateValue || null,
      available: false,
      timeSlots: [],
    };
  }

  let timeSlots = [...(store.timeSlots?.length ? store.timeSlots : Store.DEFAULT_TIME_SLOTS)];
  const dayStart = dateValue ? startOfDay(dateValue) : null;

  if (dayStart) {
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const booked = await Booking.find({
      storeId: store._id,
      appointmentDate: { $gte: dayStart, $lt: dayEnd },
      status: { $nin: ['cancelled'] },
    }).select('appointmentTime');

    const taken = new Set(booked.map((b) => b.appointmentTime).filter(Boolean));
    timeSlots = timeSlots.filter((slot) => !taken.has(slot));
  }

  return {
    storeId: store._id,
    date: dateValue || null,
    available: true,
    timeSlots,
  };
};

/**
 * Visit-us always uses the one configured store.
 * Client storeId is ignored unless it matches; invalid ids (e.g. "main-store") are accepted as auto-select.
 */
const resolveVisitStore = async (storeId) => {
  const store = await requireSingleStore({ requireActive: true });

  if (!store.availableForBooking) {
    throw new ApiError(400, 'The service centre is not available for booking.');
  }

  if (
    storeId &&
    mongoose.Types.ObjectId.isValid(storeId) &&
    String(store._id) !== String(storeId)
  ) {
    throw new ApiError(400, 'Only the configured service centre can be booked.');
  }

  return store;
};

module.exports = {
  getSingleStore,
  requireSingleStore,
  getAvailableSlots,
  resolveVisitStore,
};
