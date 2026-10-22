const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    body: { type: String, default: '' },
    bullets: [{ type: String }],
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    image: { type: String, default: null },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: true }
);

/**
 * Admin-managed CMS content for every frontend page description/section.
 */
const pageContentSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pageTitle: { type: String, default: '' },
    sections: [sectionSchema],
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: [{ type: String }],
    },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageContent', pageContentSchema);
