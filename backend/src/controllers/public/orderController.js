const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const DiscountCode = require('../../models/DiscountCode');
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { generateOrderNumber } = require('../../utils/generateCodes');
const paypalService = require('../../services/paypalService');
const config = require('../../config');

/**
 * Validate discount code
 */
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

/**
 * Helper to build an order document from request body
 */
const buildOrderData = async (req) => {
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

  return {
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
  };
};

/**
 * Helper to handle user address and marketing persistence
 */
const handleUserUpdates = async (userId, { saveInfo, shippingAddress, customer, newsOffers }) => {
  if (!userId) return;

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
    const user = await User.findById(userId);
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
    await User.findByIdAndUpdate(userId, userUpdates);
  }
};

/**
 * Standard Order creation (General / fallback)
 */
const createOrder = asyncHandler(async (req, res) => {
  const orderData = await buildOrderData(req);
  const order = await Order.create(orderData);

  if (order.bookingId) {
    await Booking.findByIdAndUpdate(order.bookingId, { orderId: order._id });
  }

  await handleUserUpdates(req.user?._id, {
    saveInfo: req.body.saveInfo,
    shippingAddress: req.body.shippingAddress,
    customer: req.body.customer,
    newsOffers: req.body.newsOffers,
  });

  const payment = await Payment.create({
    orderId: order._id,
    provider: order.paymentMethod,
    amount: order.total,
    currency: order.currency || 'GBP',
    status: 'initiated',
  });

  sendSuccess(res, {
    statusCode: 201,
    message: 'Order created',
    data: { order, payment },
  });
});

/**
 * Return PayPal client config for frontend SDK initialization
 * GET /api/v1/orders/paypal/config
 */
const getPayPalConfig = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: 'PayPal configuration fetched',
    data: {
      clientId: config.paypal.clientId || '',
      currency: config.paypal.currency || 'GBP',
      mode: config.paypal.mode || 'sandbox',
    },
  });
});

/**
 * Step 1 & 2: Frontend calls this when customer clicks PayPal Checkout.
 * Backend creates Order in DB with 'pending' status, then calls PayPal REST API
 * to create the PayPal order. Returns paypalOrderId to frontend.
 * POST /api/v1/orders/paypal/create-order
 */
const createPayPalOrder = asyncHandler(async (req, res) => {
  const orderData = await buildOrderData(req);
  orderData.paymentMethod = 'paypal';

  // 1. Create order record in MongoDB
  const order = await Order.create(orderData);

  if (order.bookingId) {
    await Booking.findByIdAndUpdate(order.bookingId, { orderId: order._id });
  }

  await handleUserUpdates(req.user?._id, {
    saveInfo: req.body.saveInfo,
    shippingAddress: req.body.shippingAddress,
    customer: req.body.customer,
    newsOffers: req.body.newsOffers,
  });

  // 2. Create PayPal Order via PayPal REST API
  const paypalOrder = await paypalService.createOrder({
    amount: order.total,
    currency: order.currency || config.paypal.currency || 'GBP',
    referenceId: order._id.toString(),
    customId: order.orderNumber,
    description: `SAMZ Order #${order.orderNumber}`,
  });

  // 3. Save initial Payment document with PayPal Order ID
  const payment = await Payment.create({
    orderId: order._id,
    provider: 'paypal',
    paypalOrderId: paypalOrder.id,
    amount: order.total,
    currency: order.currency || config.paypal.currency || 'GBP',
    status: 'initiated',
    rawResponse: paypalOrder,
  });

  sendSuccess(res, {
    statusCode: 201,
    message: 'PayPal order created successfully',
    data: {
      paypalOrderId: paypalOrder.id,
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
      paymentId: payment._id,
    },
  });
});

/**
 * Step 4: After customer approves payment on PayPal popup,
 * Frontend calls this endpoint to capture payment. Backend verifies
 * transaction via PayPal REST API and updates MongoDB.
 * POST /api/v1/orders/paypal/capture-order
 */
const capturePayPalOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId, orderId } = req.body;

  if (!paypalOrderId) {
    throw new ApiError(400, 'paypalOrderId is required.');
  }

  // Find order by orderId or by Payment with matching paypalOrderId
  let order = null;
  if (orderId) {
    order = await Order.findById(orderId);
  }
  if (!order) {
    const existingPayment = await Payment.findOne({ paypalOrderId });
    if (existingPayment) {
      order = await Order.findById(existingPayment.orderId);
    }
  }

  if (!order) {
    throw new ApiError(404, 'Associated order not found.');
  }

  // Check if already captured / paid
  if (order.paymentStatus === 'paid') {
    const payment = await Payment.findOne({ orderId: order._id });
    return sendSuccess(res, {
      message: 'Payment already captured for this order',
      data: { order, payment },
    });
  }

  // 1. Call PayPal REST API to capture payment
  const captureData = await paypalService.captureOrder(paypalOrderId);

  if (captureData.status !== 'COMPLETED') {
    // Record failure in Payment record
    await Payment.findOneAndUpdate(
      { orderId: order._id },
      {
        status: 'failed',
        paypalOrderId,
        rawResponse: captureData,
      },
      { upsert: true }
    );
    throw new ApiError(400, `PayPal payment not completed. Status: ${captureData.status}`);
  }

  // Extract transaction capture ID
  const captureUnit = captureData.purchase_units?.[0]?.payments?.captures?.[0];
  const transactionId = captureUnit?.id || captureData.id;

  // 2. Update Order status in MongoDB
  order.paymentStatus = 'paid';
  order.orderStatus = 'processing';
  await order.save();

  // 3. Update Payment record in MongoDB
  const payment = await Payment.findOneAndUpdate(
    { orderId: order._id },
    {
      status: 'completed',
      transactionId,
      paypalOrderId,
      paidAt: new Date(),
      rawResponse: captureData,
    },
    { new: true, upsert: true }
  );

  // 4. Update Booking if tied to a repair booking
  if (order.bookingId) {
    await Booking.findByIdAndUpdate(order.bookingId, { status: 'confirmed' });
  }

  sendSuccess(res, {
    message: 'Payment captured and verified successfully',
    data: { order, payment },
  });
});

/**
 * Create a PayPal order for an already existing MongoDB order
 * POST /api/v1/orders/:id/paypal-create
 */
const createPayPalOrderForExisting = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.paymentStatus === 'paid') {
    throw new ApiError(400, 'Order is already paid.');
  }

  const paypalOrder = await paypalService.createOrder({
    amount: order.total,
    currency: order.currency || config.paypal.currency || 'GBP',
    referenceId: order._id.toString(),
    customId: order.orderNumber,
    description: `SAMZ Order #${order.orderNumber}`,
  });

  const payment = await Payment.findOneAndUpdate(
    { orderId: order._id },
    {
      provider: 'paypal',
      paypalOrderId: paypalOrder.id,
      amount: order.total,
      currency: order.currency || config.paypal.currency || 'GBP',
      status: 'initiated',
      rawResponse: paypalOrder,
    },
    { new: true, upsert: true }
  );

  sendSuccess(res, {
    message: 'PayPal order created',
    data: {
      paypalOrderId: paypalOrder.id,
      orderId: order._id,
      paymentId: payment._id,
    },
  });
});

/**
 * Capture PayPal payment for an existing MongoDB order
 * POST /api/v1/orders/:id/paypal-capture
 */
const capturePayPalOrderForExisting = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body;
  if (!paypalOrderId) {
    throw new ApiError(400, 'paypalOrderId is required');
  }

  req.body.orderId = req.params.id;
  return capturePayPalOrder(req, res);
});

/**
 * Legacy/Placeholder mark order paid
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
  getPayPalConfig,
  createPayPalOrder,
  capturePayPalOrder,
  createPayPalOrderForExisting,
  capturePayPalOrderForExisting,
  markOrderPaid,
  getOrderById,
  getMyOrders,
};
