const Booking = require('../../models/Booking');
const RepairService = require('../../models/RepairService');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { generateBookingNumber } = require('../../utils/generateCodes');
const { resolveVisitStore, getAvailableSlots } = require('../../services/storeService');

const createBooking = asyncHandler(async (req, res) => {
  const {
    method,
    deviceModelId,
    deviceName,
    repairServiceIds = [],
    storeId,
    appointmentDate,
    appointmentTime,
    customer,
    mailInPackFee = 0,
    sendOffers = false,
    agreeTerms = false,
  } = req.body;

  if (!method || !['visit-us', 'mail-in'].includes(method)) {
    throw new ApiError(400, 'method must be visit-us or mail-in');
  }

  if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone) {
    throw new ApiError(400, 'Customer firstName, lastName, email and phone are required.');
  }

  if (!agreeTerms) {
    throw new ApiError(400, 'You must agree to the Terms & Conditions.');
  }

  let resolvedStoreId = null;
  if (method === 'visit-us') {
    const store = await resolveVisitStore(storeId);
    resolvedStoreId = store._id;
    if (!appointmentDate || !appointmentTime) {
      throw new ApiError(400, 'appointmentDate and appointmentTime are required for visit-us.');
    }
    if (store.timeSlots?.length && !store.timeSlots.includes(appointmentTime)) {
      throw new ApiError(400, 'Selected appointment time is not a valid slot.');
    }
    const availability = await getAvailableSlots(appointmentDate, store);
    if (!availability.timeSlots.includes(appointmentTime)) {
      throw new ApiError(400, 'Selected appointment time is no longer available.');
    }
  }

  const services = await RepairService.find({
    _id: { $in: repairServiceIds },
    isActive: true,
  });

  const repairSnapshot = services.map((s) => ({
    repairServiceId: s._id,
    title: s.title,
    price: s.price,
  }));

  const repairsTotal = repairSnapshot.reduce((sum, s) => sum + (s.price || 0), 0);
  const packFee = method === 'mail-in' ? Number(mailInPackFee) || 10 : 0;
  const subtotal = repairsTotal + packFee;

  const booking = await Booking.create({
    bookingNumber: generateBookingNumber(),
    userId: req.user?._id || null,
    method,
    deviceModelId: deviceModelId || null,
    deviceName: deviceName || '',
    repairServiceIds,
    repairSnapshot,
    storeId: resolvedStoreId,
    appointmentDate: method === 'visit-us' ? appointmentDate : null,
    appointmentTime: method === 'visit-us' ? appointmentTime : null,
    customer,
    mailInPackFee: packFee,
    subtotal,
    discount: 0,
    total: subtotal,
    status: 'pending',
    sendOffers: !!sendOffers,
    agreeTerms: true,
  });

  sendSuccess(res, {
    statusCode: 201,
    message: 'Booking created',
    data: booking,
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('storeId', 'name address city postcode')
    .populate('deviceModelId', 'name slug image')
    .populate('repairServiceIds');

  if (!booking) throw new ApiError(404, 'Booking not found');

  if (
    req.user &&
    booking.userId &&
    String(booking.userId) !== String(req.user._id) &&
    !['admin', 'staff'].includes(req.user.role)
  ) {
    throw new ApiError(403, 'Not allowed to view this booking.');
  }

  sendSuccess(res, { message: 'Booking fetched', data: booking });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const items = await Booking.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('storeId', 'name city');

  sendSuccess(res, { message: 'My bookings fetched', data: items });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (
    booking.userId &&
    String(booking.userId) !== String(req.user._id) &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Not allowed to cancel this booking.');
  }

  if (['completed', 'cancelled'].includes(booking.status)) {
    throw new ApiError(400, `Cannot cancel a ${booking.status} booking.`);
  }

  booking.status = 'cancelled';
  await booking.save();

  sendSuccess(res, { message: 'Booking cancelled', data: booking });
});

module.exports = {
  createBooking,
  getBookingById,
  getMyBookings,
  cancelBooking,
};
