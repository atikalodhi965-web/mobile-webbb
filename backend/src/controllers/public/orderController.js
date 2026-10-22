const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const DiscountCode = require('../../models/DiscountCode');
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { generateOrderNumber } = require('../../utils/generateCodes');

const validateDiscount = asyncHandler(async (req, res) => {
  const { code, subtotal = 0 } = req.body;
  if (!code) throw new ApiError(400, 'Discount code is required.');

  const discount = await DiscountCode.findOne({
    code: String(code).toUpperCase().trim(),
    isActive: true,
  });

  if (!discount) throw new ApiError(404, 'Invalid discount code.');

  const now = new Date();
  if (discount.startsAt && now < discount.startsAt) {
    throw new ApiError(400, 'Discount code is not active yet.');
  }
  if (discount.endsAt && now > discount.endsAt) {
    throw new ApiError(400, 'Discount code has expired.');
  }
  if (discount.maxUses != null && discount.usedCount >= discount.maxUses) {
    throw new ApiError(400, 'Discount code usage limit reached.');
  }
  if (Number(subtotal) < (discount.minOrderAmount || 0)) {
    throw new ApiError(400, `Minimum order amount is £${discount.minOrderAmount}.`);
  }

  let amount = 0;
  if (discount.type === 'percent') {
    amount = (Number(subtotal) * discount.value) / 100;
  } else {
    amount = discount.value;
  }
  amount = Math.min(amount, Number(subtotal));

  sendSuccess(res, {
    message: 'Discount applied',
    data: {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount: Number(amount.toFixed(2)),
    },
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    customer,
    shippingAddress,
    billingAddress,
    discountCode,
    shippingFee = 0,
    paymentMethod = 'paypal',
    bookingId,
    type = 'product',
    notes = '',
    saveInfo = false,
    newsOffers,
  } = req.body;

  if (!Array.isArray(items) || !items.length) {
    throw new ApiError(400, 'Order items are required.');
  }
  if (!customer?.email || !customer?.firstName || !customer?.lastName) {
    throw new ApiError(400, 'Customer email, firstName and lastName are required.');
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity || 1),
    0
  );

  let discountAmount = 0;
  let appliedCode = null;

  if (discountCode) {
    const discount = await DiscountCode.findOne({
      code: String(discountCode).toUpperCase().trim(),
      isActive: true,
    });
    if (discount) {
      if (discount.type === 'percent') {
        discountAmount = (subtotal * discount.value) / 100;
      } else {
        discountAmount = discount.value;
      }
      discountAmount = Math.min(discountAmount, subtotal);
      appliedCode = discount.code;
      discount.usedCount += 1;
      await discount.save();
    }
  }

  const total = Math.max(0, subtotal - discountAmount + Number(shippingFee || 0));
  const taxAmount = Number(((total * 0.2) / 1.2).toFixed(2));

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    userId: req.user?._id || null,
    type,
    items,
    customer,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    discountCode: appliedCode,
    discountAmount,
    shippingFee: Number(shippingFee) || 0,
    taxAmount,
    subtotal,
    total,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'placed',
    bookingId: bookingId || null,
    notes,
  });

  if (bookingId) {
    await Booking.findByIdAndUpdate(bookingId, { orderId: order._id });
  }

  if (req.user?._id) {
    const userUpdates = {};
    if (newsOffers !== undefined) userUpdates.marketingOptIn = !!newsOffers;

    if (saveInfo && shippingAddress) {
      const nextAddress = {
        label: 'Home',
        firstName: customer.firstName,
        lastName: customer.lastName,
        company: customer.company || '',
        address: shippingAddress.address,
        apartment: shippingAddress.apartment || '',
        city: shippingAddress.city,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country || 'United Kingdom',
        phone: customer.phone || '',
        isDefault: true,
      };
      const user = await User.findById(req.user._id);
      if (user) {
        const existingDefault = user.addresses.find((a) => a.isDefault);
        if (existingDefault) {
          Object.assign(existingDefault, nextAddress);
        } else {
          user.addresses.forEach((a) => {
            a.isDefault = false;
          });
          user.addresses.push(nextAddress);
        }
        if (newsOffers !== undefined) user.marketingOptIn = !!newsOffers;
        await user.save();
      }
    } else if (Object.keys(userUpdates).length) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }
  }

  // Placeholder payment record — replace with real PayPal capture later
  const payment = await Payment.create({
    orderId: order._id,
    provider: paymentMethod,
    amount: total,
    currency: 'GBP',
    status: 'initiated',
  });

  sendSuccess(res, {
    statusCode: 201,
    message: 'Order created',
    data: { order, payment },
  });
});

/**
 * Mark order paid (demo / webhook placeholder until PayPal is wired).
 */
const markOrderPaid = asyncHandler(async (req, res) => {
  const { transactionId, rawResponse } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.paymentStatus = 'paid';
  order.orderStatus = 'processing';
  await order.save();

  const payment = await Payment.findOneAndUpdate(
    { orderId: order._id },
    {
      status: 'completed',
      transactionId: transactionId || `TXN-${Date.now()}`,
      rawResponse: rawResponse || {},
      paidAt: new Date(),
    },
    { new: true }
  );

  if (order.bookingId) {
    await Booking.findByIdAndUpdate(order.bookingId, { status: 'confirmed' });
  }

  sendSuccess(res, {
    message: 'Payment recorded',
    data: { order, payment },
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  sendSuccess(res, { message: 'Order fetched', data: order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const items = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  sendSuccess(res, { message: 'My orders fetched', data: items });
});

module.exports = {
  validateDiscount,
  createOrder,
  markOrderPaid,
  getOrderById,
  getMyOrders,
};
