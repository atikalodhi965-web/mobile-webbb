const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

/**
 * List all users with pagination, role filter, and text search.
 */
const listUsers = asyncHandler(async (req, res) => {
  const { role, search, isActive, page = 1, limit = 50 } = req.query;
  const query = {};

  if (role) {
    query.role = role;
  }

  if (isActive !== undefined && isActive !== '') {
    query.isActive = isActive === 'true' || isActive === true;
  }

  if (search) {
    const s = search.trim();
    query.$or = [
      { name: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
      { phone: { $regex: s, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ]);

  sendSuccess(res, {
    message: 'Users fetched successfully',
    data: {
      items: items.map((u) => u.toSafeJSON()),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    },
  });
});

/**
 * Get a single user by ID.
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  sendSuccess(res, {
    message: 'User fetched successfully',
    data: user.toSafeJSON(),
  });
});

/**
 * Create a new customer or staff member.
 * Rule: Admin count must be strictly 1. If an admin already exists,
 * creating another user with role 'admin' is prevented.
 */
const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    role = 'customer',
    isActive = true,
    marketingOptIn = false,
  } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Full name is required.');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError(400, 'A valid email address is required.');
  }

  if (!password || password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters.');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(400, 'A user with this email address already exists.');
  }

  const assignedRole = ['customer', 'staff', 'admin'].includes(role) ? role : 'customer';

  // Rule: Admin should only be 1
  if (assignedRole === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount >= 1) {
      throw new ApiError(
        400,
        'Only 1 admin account is allowed in the system. To create a team member, select the Staff role.'
      );
    }
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone ? phone.trim() : '',
    role: assignedRole,
    isActive: isActive === true || isActive === 'true',
    marketingOptIn: marketingOptIn === true || marketingOptIn === 'true',
  });

  sendSuccess(res, {
    statusCode: 201,
    message: `${assignedRole.charAt(0).toUpperCase() + assignedRole.slice(1)} account created successfully`,
    data: user.toSafeJSON(),
  });
});

/**
 * Update user details.
 * Rule: Admin should only be 1. Cannot change a customer/staff to admin if one exists,
 * and cannot remove the only admin from admin role.
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { name, email, phone, role, isActive, marketingOptIn, password } = req.body;

  // Check email uniqueness if email is changed
  if (email && email.toLowerCase().trim() !== user.email) {
    const normalizedEmail = email.toLowerCase().trim();
    const emailInUse = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });
    if (emailInUse) {
      throw new ApiError(400, 'This email address is already in use by another user.');
    }
    user.email = normalizedEmail;
  }

  // Handle role modification rules
  if (role && role !== user.role) {
    if (!['customer', 'staff', 'admin'].includes(role)) {
      throw new ApiError(400, 'Invalid role specified.');
    }

    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin', _id: { $ne: user._id } });
      if (existingAdmin) {
        throw new ApiError(400, 'Only 1 admin account is allowed in the system.');
      }
    }

    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        throw new ApiError(
          400,
          'Cannot change role. The system must always have 1 primary admin account.'
        );
      }
    }

    user.role = role;
  }

  if (name !== undefined && name.trim()) {
    user.name = name.trim();
  }

  if (phone !== undefined) {
    user.phone = phone ? phone.trim() : '';
  }

  if (isActive !== undefined) {
    user.isActive = isActive === true || isActive === 'true';
  }

  if (marketingOptIn !== undefined) {
    user.marketingOptIn = marketingOptIn === true || marketingOptIn === 'true';
  }

  if (password && password.trim()) {
    if (password.length < 6) {
      throw new ApiError(400, 'New password must be at least 6 characters.');
    }
    user.password = password; // pre-save hook will hash this
  }

  await user.save();

  sendSuccess(res, {
    message: 'User updated successfully',
    data: user.toSafeJSON(),
  });
});

/**
 * Delete user.
 * Rule: Admin cannot be deleted.
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(400, 'The primary admin account cannot be deleted. The system must have 1 admin.');
  }

  if (req.user && req.user._id.toString() === user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account while logged in.');
  }

  await User.findByIdAndDelete(user._id);

  sendSuccess(res, {
    message: 'User deleted successfully',
    data: { _id: user._id, id: user._id },
  });
});

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
