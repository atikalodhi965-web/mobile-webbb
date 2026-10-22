const mongoose = require('mongoose');

/**
 * Individual repairable device (iPhone 17 Pro Max, Galaxy S25, Pixel 8, iPad Pro, MacBook…)
 * Repairs are attached to this model via RepairService.
 */
const deviceModelSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    deviceTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceType',
      required: true,
    },
    /** e.g. s-series, flip-fold, ipadPro, macbook-pro */
    categoryGroup: { type: String, default: '', trim: true },
    modelNumber: { type: String, default: '' },
    year: { type: String, default: '' },
    image: { type: String, default: null },
    images: [{ type: String }],
    href: { type: String, default: '' },
    features: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

deviceModelSchema.index({ brandId: 1, deviceTypeId: 1 });
deviceModelSchema.index({ categoryGroup: 1 });

module.exports = mongoose.model('DeviceModel', deviceModelSchema);
