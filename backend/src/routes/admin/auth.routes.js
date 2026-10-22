const express = require('express');
const { body } = require('express-validator');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/role');
const { adminLogin, adminMe } = require('../../controllers/admin/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  adminLogin
);

router.get('/me', protect, authorize('admin', 'staff'), adminMe);

module.exports = router;
