const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const generateToken = require('../../utils/generateToken');

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!['admin', 'staff'].includes(user.role)) {
    throw new ApiError(403, 'Admin access only.');
  }

  if (!user.isActive) throw new ApiError(403, 'Account is deactivated.');

  const token = generateToken(user._id);

  sendSuccess(res, {
    message: 'Admin login successful',
    data: { user: user.toSafeJSON(), token },
  });
});

const adminMe = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: 'Admin profile fetched',
    data: req.user.toSafeJSON(),
  });
});

module.exports = { adminLogin, adminMe };
