const express = require('express');
const authRoutes = require('./auth.routes');
const catalogRoutes = require('./catalog.routes');
const repairRoutes = require('./repair.routes');
const productRoutes = require('./product.routes');
const storeRoutes = require('./store.routes');
const bookingRoutes = require('./booking.routes');
const orderRoutes = require('./order.routes');
const contentRoutes = require('./content.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', catalogRoutes);
router.use('/repairs', repairRoutes);
router.use('/products', productRoutes);
router.use('/stores', storeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/orders', orderRoutes);
router.use('/cms', contentRoutes);

module.exports = router;
