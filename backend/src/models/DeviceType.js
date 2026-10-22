const mongoose = require('mongoose');

const deviceTypeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    priceFrom: { type: Number, default: 0 },
    currency: { type: String, default: 'GBP' },
    buttonText: { type: String, default: 'Book Repair' },
    image: { type: String, default: null },
    href: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeviceType', deviceTypeSchema);
