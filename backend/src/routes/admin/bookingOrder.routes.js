const express = require('express');
const {
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
} = require('../../controllers/admin/bookingOrderController');

const router = express.Router();

router.get('/bookings', listBookings);
router.post('/bookings', createBooking);
router.get('/bookings/:id', getBooking);
router.put('/bookings/:id', updateBooking);
router.patch('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

router.get('/orders', listOrders);
router.get('/orders/:id', getOrder);
router.patch('/orders/:id/status', updateOrderStatus);

router.get('/payments', listPayments);

module.exports = router;
