const Order = require('../../models/Order');
const Booking = require('../../models/Booking');
const Product = require('../../models/Product');
const User = require('../../models/User');
const Payment = require('../../models/Payment');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const getStats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    paidOrders,
    totalBookings,
    pendingBookings,
    totalProducts,
    activeProducts,
    totalCustomers,
    payments,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ paymentStatus: 'paid' }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'customer' }),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  const lowStock = await Product.find({
    isActive: true,
    'stockByVariant.stock': { $lte: 2 },
  })
    .select('name slug stockByVariant image')
    .limit(10);

  sendSuccess(res, {
    message: 'Dashboard stats',
    data: {
      orders: { total: totalOrders, paid: paidOrders },
      bookings: { total: totalBookings, pending: pendingBookings },
      products: { total: totalProducts, active: activeProducts },
      customers: totalCustomers,
      revenue: payments[0]?.revenue || 0,
      completedPayments: payments[0]?.count || 0,
      lowStock,
    },
  });
});

module.exports = { getStats };
