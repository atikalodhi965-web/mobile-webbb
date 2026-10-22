const mongoose = require('mongoose');

const customerSnapshotSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    postcode: { type: String, default: '' },
    devicePasscode: { type: String, default: '' },
    mobileNetwork: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
  },
  { _id: false }
);

const repairSnapshotSchema = new mongoose.Schema(
  {
    repairServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairService' },
    title: String,
    price: Number,
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    method: { type: String, enum: ['visit-us', 'mail-in'], required: true },
    deviceModelId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceModel', default: null },
    deviceName: { type: String, default: '' },
    repairServiceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RepairService' }],
    repairSnapshot: [repairSnapshotSchema],
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
    appointmentDate: { type: Date, default: null },
    appointmentTime: { type: String, default: null },
    customer: { type: customerSnapshotSchema, required: true },
    mailInPackFee: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    sendOffers: { type: Boolean, default: false },
    agreeTerms: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ storeId: 1, appointmentDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
