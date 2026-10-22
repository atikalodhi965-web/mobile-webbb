const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ['paypal', 'klarna', 'card', 'other'],
      required: true,
    },
    transactionId: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'GBP' },
    status: {
      type: String,
      enum: ['initiated', 'completed', 'failed', 'refunded'],
      default: 'initiated',
    },
    rawResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
