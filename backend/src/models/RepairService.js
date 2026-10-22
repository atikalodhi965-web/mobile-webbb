const mongoose = require('mongoose');

/**
 * Priced repair option for ONE specific DeviceModel.
 * Example: iPhone 17 → Front screen → "Screen Replacement" £129
 */
const repairServiceSchema = new mongoose.Schema(
  {
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceModel',
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RepairCategory',
      required: true,
      index: true,
    },
    slug: { type: String, required: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'GBP' },
    warranty: { type: String, default: '' },
    repairTime: { type: String, default: '' },
    note: { type: String, default: '' },
    icon: { type: String, default: '' },
    image: { type: String, default: null },
    partType: {
      type: String,
      enum: ['standard', 'genuine', 'oem', 'other'],
      default: 'standard',
    },
    features: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

repairServiceSchema.index({ modelId: 1, categoryId: 1 });
repairServiceSchema.index({ modelId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('RepairService', repairServiceSchema);
