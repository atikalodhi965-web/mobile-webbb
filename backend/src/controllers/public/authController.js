const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const generateToken = require('../../utils/generateToken');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, marketingOptIn } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, 'Email is already registered.');

  const user = await User.create({
    name,
    email,
    password,
    phone,
    marketingOptIn: !!marketingOptIn,
    role: 'customer',
  });

  const token = generateToken(user._id);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user: user.toSafeJSON(), token },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) throw new ApiError(403, 'Account is deactivated.');

  const token = generateToken(user._id);

  sendSuccess(res, {
    message: 'Login successful',
    data: { user: user.toSafeJSON(), token },
  });
});

const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: 'Profile fetched',
    data: req.user.toSafeJSON(),
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'marketingOptIn', 'addresses', 'avatar'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { message: 'Profile updated', data: user.toSafeJSON() });
});

module.exports = { register, login, getMe, updateMe };
