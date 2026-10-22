const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ['refurbished', 'repair', 'mail_pack', 'protection', 'other'],
      required: true,
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    repairServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairService', default: null },
    name: { type: String, required: true },
    specs: { type: String, default: '' },
    color: { type: String, default: '' },
    capacity: { type: String, default: '' },
    condition: { type: String, default: '' },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: null },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    address: String,
    apartment: String,
    city: String,
    postcode: String,
    country: { type: String, default: 'United Kingdom' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    type: {
      type: String,
      enum: ['product', 'repair', 'mixed'],
      default: 'product',
    },
    items: [orderItemSchema],
    customer: {
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      company: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    discountCode: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: 'GBP' },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'klarna', 'card', 'other'],
      default: 'paypal',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'completed', 'cancelled'],
      default: 'placed',
    },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.index({ paymentStatus: 1, orderStatus: 1 });
orderSchema.index({ 'customer.email': 1 });

module.exports = mongoose.model('Order', orderSchema);
