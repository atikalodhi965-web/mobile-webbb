const mongoose = require('mongoose');
const Product = require('../../models/Product');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const getProducts = asyncHandler(async (req, res) => {
  const {
    brand,
    brands,
    type,
    category,
    capacity,
    capacities,
    condition,
    conditions,
    maxPrice,
    minPrice,
    featured,
    search,
    page = 1,
    limit = 24,
    sort = 'sortOrder',
  } = req.query;

  const query = { isActive: true };

  if (brand) query.brand = new RegExp(`^${brand}$`, 'i');
  if (brands) {
    const list = String(brands).split(',').map((b) => b.trim());
    query.brand = { $in: list.map((b) => new RegExp(`^${b}$`, 'i')) };
  }
  if (type) query.type = type;
  if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;

  if (capacity || capacities) {
    const caps = String(capacities || capacity)
      .split(',')
      .map((c) => c.trim());
    query.capacities = { $in: caps };
  }

  if (condition || conditions) {
    const conds = String(conditions || condition)
      .split(',')
      .map((c) => c.trim());
    query.conditions = { $in: conds };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { tagline: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(60, parseInt(limit, 10) || 24);
  const skip = (pageNum - 1) * limitNum;

  let sortOption = { sortOrder: 1, createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const [items, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  sendSuccess(res, {
    message: 'Products fetched',
    data: {
      items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    },
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;
  const filter = { isActive: true };

  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    filter.$or = [{ slug: slugOrId }, { _id: slugOrId }];
  } else {
    filter.slug = slugOrId;
  }

  const product = await Product.findOne(filter).populate('brandId', 'name slug image');

  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, { message: 'Product fetched', data: product });
});

module.exports = { getProducts, getProductBySlug };
