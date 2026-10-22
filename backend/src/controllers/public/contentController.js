const Review = require('../../models/Review');
const Faq = require('../../models/Faq');
const PageContent = require('../../models/PageContent');
const HeroSlide = require('../../models/HeroSlide');
const ProtectionPlan = require('../../models/ProtectionPlan');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const getHeroSlides = asyncHandler(async (req, res) => {
  const items = await HeroSlide.find({ isActive: true }).sort({ sortOrder: 1 });
  sendSuccess(res, { message: 'Hero slides fetched', data: items });
});

const getReviews = asyncHandler(async (req, res) => {
  const items = await Review.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  sendSuccess(res, { message: 'Reviews fetched', data: items });
});

const getFaqs = asyncHandler(async (req, res) => {
  const query = { isActive: true };
  if (req.query.pageKey) query.pageKey = req.query.pageKey;

  const items = await Faq.find(query).sort({ sortOrder: 1 });
  sendSuccess(res, { message: 'FAQs fetched', data: items });
});

const getPageContent = asyncHandler(async (req, res) => {
  const page = await PageContent.findOne({
    pageKey: req.params.pageKey.toLowerCase(),
    isPublished: true,
  });

  if (!page) throw new ApiError(404, 'Page content not found');
  sendSuccess(res, { message: 'Page content fetched', data: page });
});

const getProtection = asyncHandler(async (req, res) => {
  const plan = await ProtectionPlan.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (!plan) throw new ApiError(404, 'Protection plan not found');
  sendSuccess(res, { message: 'Protection plan fetched', data: plan });
});

module.exports = {
  getHeroSlides,
  getReviews,
  getFaqs,
  getPageContent,
  getProtection,
};
