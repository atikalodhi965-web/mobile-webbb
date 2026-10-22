const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    quote: { type: String, required: true },
    author: { type: String, required: true },
    location: { type: String, default: '' },
    source: { type: String, default: 'Google review' },
    image: { type: String, default: null },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
