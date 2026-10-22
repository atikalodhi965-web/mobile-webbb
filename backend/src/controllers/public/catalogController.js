const DeviceType = require('../../models/DeviceType');
const Brand = require('../../models/Brand');
const DeviceModel = require('../../models/DeviceModel');
const Product = require('../../models/Product');
const RepairService = require('../../models/RepairService');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const getDeviceTypes = asyncHandler(async (req, res) => {
  const items = await DeviceType.find({ isActive: true }).sort({ sortOrder: 1 });
  sendSuccess(res, { message: 'Device types fetched', data: items });
});

const getBrands = asyncHandler(async (req, res) => {
  const query = { isActive: true };
  if (req.query.deviceTypeId) query.deviceTypeIds = req.query.deviceTypeId;
  if (req.query.deviceType) {
    const dt = await DeviceType.findOne({
      $or: [{ slug: req.query.deviceType }, { _id: req.query.deviceType }],
      isActive: true,
    });
    if (dt) query.deviceTypeIds = dt._id;
  }

  const items = await Brand.find(query)
    .populate('deviceTypeIds', 'title slug')
    .sort({ sortOrder: 1 });

  sendSuccess(res, { message: 'Brands fetched', data: items });
});

const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true }).populate(
    'deviceTypeIds',
    'title slug'
  );
  if (!brand) throw new ApiError(404, 'Brand not found');

  const models = await DeviceModel.find({ brandId: brand._id, isActive: true })
    .populate('deviceTypeId', 'title slug')
    .sort({ sortOrder: 1, name: 1 });

  sendSuccess(res, { message: 'Brand fetched', data: { brand, models } });
});

const getModels = asyncHandler(async (req, res) => {
  const query = { isActive: true };

  if (req.query.brandId) query.brandId = req.query.brandId;
  if (req.query.deviceTypeId) query.deviceTypeId = req.query.deviceTypeId;
  if (req.query.categoryGroup) query.categoryGroup = req.query.categoryGroup;

  if (req.query.brand) {
    const brand = await Brand.findOne({ slug: req.query.brand, isActive: true });
    if (brand) query.brandId = brand._id;
  }

  if (req.query.deviceType) {
    const dt = await DeviceType.findOne({ slug: req.query.deviceType, isActive: true });
    if (dt) query.deviceTypeId = dt._id;
  }

  const items = await DeviceModel.find(query)
    .populate('brandId', 'name slug image')
    .populate('deviceTypeId', 'title slug')
    .sort({ sortOrder: 1, name: 1 });

  sendSuccess(res, { message: 'Models fetched', data: items });
});

const getModelBySlug = asyncHandler(async (req, res) => {
  const model = await DeviceModel.findOne({ slug: req.params.slug, isActive: true })
    .populate('brandId', 'name slug image description')
    .populate('deviceTypeId', 'title slug');

  if (!model) throw new ApiError(404, 'Device model not found');
  sendSuccess(res, { message: 'Model fetched', data: model });
});

const searchCatalog = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters.');
  }

  const regex = { $regex: q, $options: 'i' };

  const [products, models, repairs] = await Promise.all([
    Product.find({
      isActive: true,
      $or: [{ name: regex }, { brand: regex }, { tagline: regex }],
    })
      .select('name slug brand price image tag')
      .limit(8),
    DeviceModel.find({
      isActive: true,
      $or: [{ name: regex }, { categoryGroup: regex }],
    })
      .select('name slug image href')
      .limit(8),
    RepairService.find({ isActive: true, title: regex })
      .select('title slug price modelId')
      .limit(8),
  ]);

  sendSuccess(res, {
    message: 'Search results',
    data: { products, models, repairs },
  });
});

module.exports = {
  getDeviceTypes,
  getBrands,
  getBrandBySlug,
  getModels,
  getModelBySlug,
  searchCatalog,
};
