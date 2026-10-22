const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    deviceTypeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DeviceType' }],
    image: { type: String, default: null },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);
