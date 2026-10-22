const mongoose = require('mongoose');

const openingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    open: { type: String, default: '10:00' },
    close: { type: String, default: '18:30' },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const DEFAULT_TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

const storeSchema = new mongoose.Schema(
  {
    // Enforces a single service-centre document for the whole site.
    key: { type: String, default: 'primary', unique: true, immutable: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    region: {
      type: String,
      enum: ['London', 'Nationwide', 'Other'],
      default: 'London',
    },
    address: { type: String, required: true },
    city: { type: String, default: '' },
    postcode: { type: String, default: '' },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    phone: { type: String, default: '' },
    image: { type: String, default: null },
    openingHours: [openingHourSchema],
    availableForBooking: { type: Boolean, default: true },
    timeSlots: {
      type: [String],
      default: DEFAULT_TIME_SLOTS,
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

storeSchema.statics.DEFAULT_TIME_SLOTS = DEFAULT_TIME_SLOTS;

module.exports = mongoose.model('Store', storeSchema);
