const express = require('express');
const { protect, optionalAuth } = require('../../middlewares/auth');
const {
  validateDiscount,
  createOrder,
  markOrderPaid,
  getOrderById,
  getMyOrders,
} = require('../../controllers/public/orderController');

const router = express.Router();

router.post('/discounts/validate', validateDiscount);
router.post('/', optionalAuth, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/pay', markOrderPaid);

module.exports = router;
