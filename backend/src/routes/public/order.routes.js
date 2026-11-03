const express = require('express');
const { protect, optionalAuth } = require('../../middlewares/auth');
const {
  validateDiscount,
  createOrder,
  getPayPalConfig,
  createPayPalOrder,
  capturePayPalOrder,
  createPayPalOrderForExisting,
  capturePayPalOrderForExisting,
  markOrderPaid,
  getOrderById,
  getMyOrders,
} = require('../../controllers/public/orderController');

const router = express.Router();

// PayPal Configuration & Gateway routes
router.get('/paypal/config', getPayPalConfig);
router.post('/paypal/create-order', optionalAuth, createPayPalOrder);
router.post('/paypal/capture-order', optionalAuth, capturePayPalOrder);

// Existing Order PayPal routes
router.post('/:id/paypal-create', optionalAuth, createPayPalOrderForExisting);
router.post('/:id/paypal-capture', optionalAuth, capturePayPalOrderForExisting);

// General Order routes
router.post('/discounts/validate', validateDiscount);
router.post('/', optionalAuth, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/pay', markOrderPaid);

module.exports = router;
