const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, default: '#000000' },
    phoneBg: { type: String, default: '' },
    screenGradient: { type: String, default: '' },
    image: { type: String, default: null },
  },
  { _id: false }
);

const conditionPriceSchema = new mongoose.Schema(
  {
    condition: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const variantStockSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    capacity: { type: String, required: true },
    condition: { type: String, required: true },
    sku: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const descriptionBulletSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    text: { type: String, default: '' },
  },
  { _id: false }
);

/**
 * Refurbished / sellable products (phones, tablets, laptops).
 * Images and all product content are admin-managed.
 */
const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', default: null },
    brand: { type: String, default: '' },
    category: { type: String, default: '' },
    deviceTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceType', default: null },
    tagline: { type: String, default: '' },
    tag: { type: String, default: null },
    type: {
      type: String,
      enum: ['phone', 'tablet', 'laptop', 'accessory', 'other'],
      default: 'phone',
    },
    image: { type: String, default: null },
    images: [{ type: String }],
    colors: [colorSchema],
    capacities: [{ type: String }],
    conditions: [{ type: String }],
    conditionPrices: [conditionPriceSchema],
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    stockByVariant: [variantStockSchema],
    description: {
      text: { type: String, default: '' },
      bullets: [descriptionBulletSchema],
    },
    features: [{ type: String }],
    warranty: { type: String, default: '' },
    returns: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ brand: 1, type: 1, price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
