const mongoose = require('mongoose');

/**
 * Shared repair category labels (Front screen, Battery, Camera…)
 * Actual priced repairs live in RepairService and are tied to a DeviceModel.
 */
const repairCategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortTitle: { type: String, default: '' },
    icon: { type: String, default: '' },
    image: { type: String, default: null },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RepairCategory', repairCategorySchema);
