const Review = require('../../models/Review');
const Faq = require('../../models/Faq');
const PageContent = require('../../models/PageContent');
const HeroSlide = require('../../models/HeroSlide');
const ProtectionPlan = require('../../models/ProtectionPlan');
const Store = require('../../models/Store');
const DiscountCode = require('../../models/DiscountCode');
const createCrudController = require('../../services/crudFactory');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const toSlug = require('../../utils/slugify');
const { getSingleStore } = require('../../services/storeService');
const reviewAdmin = createCrudController(Review, {
  resourceName: 'Review',
  slugField: null,
  searchFields: ['author', 'quote', 'location', 'source'],
});

const faqAdmin = createCrudController(Faq, {
  resourceName: 'Faq',
  slugField: null,
  searchFields: ['question', 'answer', 'pageKey'],
});

const heroSlideAdmin = createCrudController(HeroSlide, {
  resourceName: 'HeroSlide',
  slugField: null,
  searchFields: ['title', 'subtitle'],
});

const getStore = asyncHandler(async (req, res) => {
  const store = await getSingleStore();
  sendSuccess(res, {
    message: store ? 'Store fetched' : 'Store not configured yet',
    data: store,
  });
});

const upsertStore = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  delete body.key;
  delete body._id;
  delete body.id;

  const existing = await getSingleStore();
  if (!existing && (!body.name || !body.address)) {
    throw new ApiError(400, 'Store name and address are required.');
  }

  if (!body.slug && body.name) {
    body.slug = toSlug(body.name);
  }

  if (req.file) {
    body.image = `/uploads/${req.uploadFolder || 'cms'}/${req.file.filename}`;
  }

  ['isActive', 'availableForBooking'].forEach((field) => {
    if (body[field] === 'true') body[field] = true;
    if (body[field] === 'false') body[field] = false;
  });

  ['lat', 'lng', 'sortOrder'].forEach((field) => {
    if (body[field] !== undefined && body[field] !== '' && !Number.isNaN(Number(body[field]))) {
      body[field] = Number(body[field]);
    }
  });

  const store = await Store.findOneAndUpdate(
    { key: 'primary' },
    { $set: body, $setOnInsert: { key: 'primary' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { message: 'Store saved', data: store });
});

const discountAdmin = createCrudController(DiscountCode, {
  resourceName: 'DiscountCode',
  slugField: null,
  searchFields: ['code'],
});

const protectionAdmin = createCrudController(ProtectionPlan, {
  resourceName: 'ProtectionPlan',
  slugSource: 'name',
  searchFields: ['name', 'slug', 'tagline'],
});

const getAllPages = asyncHandler(async (req, res) => {
  const pages = await PageContent.find().sort({ pageKey: 1 });
  sendSuccess(res, { message: 'CMS pages fetched', data: pages });
});

const getPageByKey = asyncHandler(async (req, res) => {
  const page = await PageContent.findOne({ pageKey: req.params.pageKey });
  if (!page) throw new ApiError(404, 'Page content not found');
  sendSuccess(res, { message: 'Page content fetched', data: page });
});

const upsertPage = asyncHandler(async (req, res) => {
  const pageKey = (req.body.pageKey || req.params.pageKey || '').toLowerCase();
  if (!pageKey) throw new ApiError(400, 'pageKey is required');

  const payload = {
    ...req.body,
    pageKey,
    updatedBy: req.user._id,
  };

  if (req.file) {
    const imagePath = `/uploads/${req.uploadFolder || 'cms'}/${req.file.filename}`;
    if (!payload.sections) payload.sections = [];
    // attach image to first section if provided as single upload
    if (payload.sections[0]) payload.sections[0].image = imagePath;
  }

  const page = await PageContent.findOneAndUpdate(
    { pageKey },
    payload,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { message: 'Page content saved', data: page });
});

const deletePage = asyncHandler(async (req, res) => {
  const page = await PageContent.findOneAndDelete({ pageKey: req.params.pageKey });
  if (!page) throw new ApiError(404, 'Page content not found');
  sendSuccess(res, { message: 'Page content deleted', data: page });
});

module.exports = {
  reviewAdmin,
  faqAdmin,
  heroSlideAdmin,
  getStore,
  upsertStore,
  discountAdmin,
  protectionAdmin,
  getAllPages,
  getPageByKey,
  upsertPage,
  deletePage,
};
