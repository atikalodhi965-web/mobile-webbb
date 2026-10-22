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
  const { search } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { pageKey: { $regex: search, $options: 'i' } },
      { pageTitle: { $regex: search, $options: 'i' } },
    ];
  }
  const pages = await PageContent.find(query).sort({ pageKey: 1 });
  sendSuccess(res, {
    message: 'CMS pages fetched',
    data: {
      items: pages,
      pagination: { total: pages.length, page: 1, limit: 100, pages: 1 },
    },
  });
});

const getPageByKey = asyncHandler(async (req, res) => {
  const mongoose = require('mongoose');
  const param = req.params.pageKey;
  let page = null;
  if (mongoose.Types.ObjectId.isValid(param)) {
    page = await PageContent.findOne({ $or: [{ _id: param }, { pageKey: param.toLowerCase() }] });
  } else {
    page = await PageContent.findOne({ pageKey: param.toLowerCase() });
  }
  if (!page) throw new ApiError(404, 'Page content not found');
  sendSuccess(res, { message: 'Page content fetched', data: page });
});

const upsertPage = asyncHandler(async (req, res) => {
  const mongoose = require('mongoose');
  const param = req.params.pageKey;
  let pageKey = (req.body.pageKey || '').toLowerCase().trim();

  if (!pageKey && param) {
    if (mongoose.Types.ObjectId.isValid(param)) {
      const existing = await PageContent.findById(param);
      if (existing) pageKey = existing.pageKey;
    } else {
      pageKey = param.toLowerCase().trim();
    }
  }

  if (!pageKey) throw new ApiError(400, 'pageKey is required');

  const payload = {
    ...req.body,
    pageKey,
    updatedBy: req.user?._id || null,
  };

  if (typeof payload.sections === 'string') {
    try {
      payload.sections = JSON.parse(payload.sections);
    } catch {
      payload.sections = payload.sections ? [{ sectionKey: 'main', body: payload.sections }] : [];
    }
  }

  if (typeof payload.seo === 'string') {
    try {
      payload.seo = JSON.parse(payload.seo);
    } catch {
      payload.seo = {};
    }
  }

  if (payload.isPublished !== undefined) {
    payload.isPublished = payload.isPublished === true || payload.isPublished === 'true';
  }

  if (req.file) {
    const imagePath = `/uploads/${req.uploadFolder || 'cms'}/${req.file.filename}`;
    if (!payload.sections || !Array.isArray(payload.sections)) payload.sections = [];
    if (!payload.sections[0]) {
      payload.sections[0] = { sectionKey: 'hero', image: imagePath };
    } else {
      payload.sections[0].image = imagePath;
    }
  }

  const page = await PageContent.findOneAndUpdate(
    { pageKey },
    payload,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { message: 'Page content saved', data: page });
});

const deletePage = asyncHandler(async (req, res) => {
  const mongoose = require('mongoose');
  const param = req.params.pageKey;
  let page;
  if (mongoose.Types.ObjectId.isValid(param)) {
    page = await PageContent.findOneAndDelete({ $or: [{ _id: param }, { pageKey: param.toLowerCase() }] });
  } else {
    page = await PageContent.findOneAndDelete({ pageKey: param.toLowerCase() });
  }
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
