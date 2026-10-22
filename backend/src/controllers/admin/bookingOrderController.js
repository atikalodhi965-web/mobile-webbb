const Booking = require('../../models/Booking');
const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const listBookings = asyncHandler(async (req, res) => {
  const { status, storeId, method, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (storeId) query.storeId = storeId;
  if (method) query.method = method;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Booking.find(query)
      .populate('storeId', 'name city')
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

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  if (!allowed.includes(status)) throw new ApiError(400, 'Invalid booking status');

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

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
  updateBookingStatus,
  listOrders,
  getOrder,
  updateOrderStatus,
  listPayments,
  listUsers,
  updateUser,
};
