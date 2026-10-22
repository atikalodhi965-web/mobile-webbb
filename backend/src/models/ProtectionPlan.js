const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
  },
  { _id: false }
);

const termsTabSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
  },
  { _id: false }
);

const protectionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '' },
    image: { type: String, default: null },
    features: [featureSchema],
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'GBP' },
    guaranteeMonths: { type: Number, default: 12 },
    termsTabs: [termsTabSchema],
    bodySections: [
      {
        key: String,
        title: String,
        content: String,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProtectionPlan', protectionPlanSchema);
