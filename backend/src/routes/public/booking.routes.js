const express = require('express');
const { protect, optionalAuth } = require('../../middlewares/auth');
const {
  createBooking,
  getBookingById,
  getMyBookings,
  cancelBooking,
} = require('../../controllers/public/bookingController');

const router = express.Router();

router.post('/', optionalAuth, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', optionalAuth, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
