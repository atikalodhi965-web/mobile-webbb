const Booking = require('../../models/Booking');
const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const User = require('../../models/User');
const Store = require('../../models/Store');
const RepairService = require('../../models/RepairService');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { generateBookingNumber } = require('../../utils/generateCodes');

const listBookings = asyncHandler(async (req, res) => {
  const { status, storeId, method, search, page = 1, limit = 50 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (storeId) query.storeId = storeId;
  if (method) query.method = method;

  if (search) {
    const s = search.trim();
    query.$or = [
      { bookingNumber: { $regex: s, $options: 'i' } },
      { deviceName: { $regex: s, $options: 'i' } },
      { 'customer.firstName': { $regex: s, $options: 'i' } },
      { 'customer.lastName': { $regex: s, $options: 'i' } },
      { 'customer.email': { $regex: s, $options: 'i' } },
      { 'customer.phone': { $regex: s, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 50);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Booking.find(query)
      .populate('storeId', 'name city address')
      .populate('deviceModelId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Booking.countDocuments(query),
  ]);

  sendSuccess(res, {
    message: 'Bookings fetched',
    data: {
      items,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1 },
    },
  });
});

const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('storeId')
    .populate('deviceModelId')
    .populate('repairServiceIds')
    .populate('orderId');

  if (!booking) throw new ApiError(404, 'Booking not found');
  sendSuccess(res, { message: 'Booking fetched', data: booking });
});

const createBooking = asyncHandler(async (req, res) => {
  const {
    method = 'visit-us',
    deviceModelId,
    deviceName,
    repairServiceIds = [],
    repairTitle,
    repairPrice,
    storeId,
    appointmentDate,
    appointmentTime,
    customer = {},
    status = 'pending',
    total,
    notes,
    additionalInfo,
    devicePasscode,
    mobileNetwork,
  } = req.body;

  if (!customer.firstName || !customer.email || !customer.phone) {
    throw new ApiError(400, 'Customer first name, email, and phone number are required.');
  }

  let repairSnapshot = [];
  if (Array.isArray(repairServiceIds) && repairServiceIds.length > 0) {
    const services = await RepairService.find({ _id: { $in: repairServiceIds } });
    repairSnapshot = services.map((s) => ({
      repairServiceId: s._id,
      title: s.title,
      price: s.price,
    }));
  } else if (repairTitle) {
    repairSnapshot = [
      {
        title: repairTitle,
        price: parseFloat(repairPrice) || 0,
      },
    ];
  }

  const repairsTotal = repairSnapshot.reduce((sum, r) => sum + (r.price || 0), 0);
  const calculatedTotal = total !== undefined && total !== '' ? parseFloat(total) : repairsTotal;

  let resolvedStoreId = storeId || null;
  if (method === 'visit-us' && !resolvedStoreId) {
    const defaultStore = await Store.findOne({ key: 'primary' });
    if (defaultStore) resolvedStoreId = defaultStore._id;
  }

  const customerSnapshot = {
    firstName: customer.firstName.trim(),
    lastName: (customer.lastName || '').trim() || customer.firstName.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    postcode: customer.postcode || '',
    devicePasscode: devicePasscode || customer.devicePasscode || '',
    mobileNetwork: mobileNetwork || customer.mobileNetwork || '',
    additionalInfo: notes || additionalInfo || customer.additionalInfo || '',
  };

  const booking = await Booking.create({
    bookingNumber: generateBookingNumber(),
    userId: null,
    method,
    deviceModelId: deviceModelId || null,
    deviceName: deviceName || '',
    repairServiceIds: Array.isArray(repairServiceIds) ? repairServiceIds : [],
    repairSnapshot,
    storeId: resolvedStoreId,
    appointmentDate: appointmentDate ? new Date(appointmentDate) : new Date(),
    appointmentTime: appointmentTime || '10:00 AM',
    customer: customerSnapshot,
    mailInPackFee: method === 'mail-in' ? 10 : 0,
    subtotal: calculatedTotal,
    discount: 0,
    total: calculatedTotal,
    status: status || 'pending',
    sendOffers: false,
    agreeTerms: true,
  });

  const populated = await Booking.findById(booking._id)
    .populate('storeId', 'name city address')
    .populate('deviceModelId', 'name slug');

  sendSuccess(res, {
    statusCode: 201,
    message: 'Booking created successfully',
    data: populated,
  });
});

const updateBooking = asyncHandler(async (req, res) => {
  const {
    status,
    method,
    deviceName,
    deviceModelId,
    storeId,
    appointmentDate,
    appointmentTime,
    customer,
    total,
    notes,
    repairTitle,
    repairPrice,
  } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (status) booking.status = status;
  if (method) booking.method = method;
  if (deviceName !== undefined) booking.deviceName = deviceName;
  if (deviceModelId !== undefined) booking.deviceModelId = deviceModelId || null;
  if (storeId !== undefined) booking.storeId = storeId || null;
  if (appointmentDate) booking.appointmentDate = new Date(appointmentDate);
  if (appointmentTime !== undefined) booking.appointmentTime = appointmentTime;
  if (total !== undefined && !isNaN(Number(total))) {
    booking.total = Number(total);
    booking.subtotal = Number(total);
  }

  if (customer && typeof customer === 'object') {
    booking.customer = {
      ...booking.customer.toObject(),
      ...customer,
    };
  }
  if (notes) {
    booking.customer.additionalInfo = notes;
  }
  if (repairTitle) {
    booking.repairSnapshot = [
      {
        title: repairTitle,
        price: parseFloat(repairPrice) || booking.total || 0,
      },
    ];
  }

  await booking.save();

  const populated = await Booking.findById(booking._id)
    .populate('storeId', 'name city address')
    .populate('deviceModelId', 'name slug');

  sendSuccess(res, { message: 'Booking updated successfully', data: populated });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  sendSuccess(res, { message: 'Booking deleted successfully', data: booking });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  if (!allowed.includes(status)) throw new ApiError(400, 'Invalid booking status');

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('storeId', 'name city address').populate('deviceModelId', 'name slug');

  if (!booking) throw new ApiError(404, 'Booking not found');
  sendSuccess(res, { message: 'Booking status updated', data: booking });
});

const listOrders = asyncHandler(async (req, res) => {
  const { paymentStatus, orderStatus, page = 1, limit = 20 } = req.query;
  const query = {};
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (orderStatus) query.orderStatus = orderStatus;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Order.countDocuments(query),
  ]);

  sendSuccess(res, {
    message: 'Orders fetched',
    data: {
      items,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1 },
    },
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('bookingId');
  if (!order) throw new ApiError(404, 'Order not found');

  const payments = await Payment.find({ orderId: order._id }).sort({ createdAt: -1 });

  sendSuccess(res, { message: 'Order fetched', data: { order, payments } });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const updates = {};
  if (orderStatus) updates.orderStatus = orderStatus;
  if (paymentStatus) updates.paymentStatus = paymentStatus;

  const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!order) throw new ApiError(404, 'Order not found');

  sendSuccess(res, { message: 'Order updated', data: order });
});

const listPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('orderId', 'orderNumber total customer paymentStatus')
    .sort({ createdAt: -1 })
    .limit(100);

  sendSuccess(res, { message: 'Payments fetched', data: payments });
});

const listUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ]);

  sendSuccess(res, {
    message: 'Users fetched',
    data: {
      items: items.map((u) => u.toSafeJSON()),
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1 },
    },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'role', 'isActive', 'marketingOptIn'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, { message: 'User updated', data: user.toSafeJSON() });
});

module.exports = {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  listOrders,
  getOrder,
  updateOrderStatus,
  listPayments,
  listUsers,
  updateUser,
};
