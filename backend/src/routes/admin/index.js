const express = require('express');
const { protect } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { getStats } = require('../../controllers/admin/dashboardController');

const authRoutes = require('./auth.routes');
const catalogRoutes = require('./catalog.routes');
const repairRoutes = require('./repair.routes');
const productRoutes = require('./product.routes');
const cmsRoutes = require('./cms.routes');
const bookingOrderRoutes = require('./bookingOrder.routes');
const mediaRoutes = require('./media.routes');

const router = express.Router();

// Public admin login
router.use('/auth', authRoutes);

// All routes below require admin/staff
router.use(protect, authorize('admin', 'staff'));

router.get('/dashboard/stats', getStats);
router.use('/catalog', catalogRoutes);
router.use('/repairs', repairRoutes);
router.use('/products', productRoutes);
router.use('/cms', cmsRoutes);
router.use('/', bookingOrderRoutes);
router.use('/media', mediaRoutes);

module.exports = router;
