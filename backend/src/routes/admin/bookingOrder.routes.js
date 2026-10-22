const express = require('express');
const {
  listBookings,
  getBooking,
  updateBookingStatus,
  listOrders,
  getOrder,
  updateOrderStatus,
  listPayments,
  listUsers,
  updateUser,
} = require('../../controllers/admin/bookingOrderController');

const router = express.Router();

router.get('/bookings', listBookings);
router.get('/bookings/:id', getBooking);
router.patch('/bookings/:id/status', updateBookingStatus);

router.get('/orders', listOrders);
router.get('/orders/:id', getOrder);
router.patch('/orders/:id/status', updateOrderStatus);

router.get('/payments', listPayments);

router.get('/users', listUsers);
router.patch('/users/:id', updateUser);

module.exports = router;
