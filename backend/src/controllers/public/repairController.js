const RepairCategory = require('../../models/RepairCategory');
const RepairService = require('../../models/RepairService');
const DeviceModel = require('../../models/DeviceModel');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const getRepairCategories = asyncHandler(async (req, res) => {
  const items = await RepairCategory.find({ isActive: true }).sort({ sortOrder: 1 });
  sendSuccess(res, { message: 'Repair categories fetched', data: items });
});

/**
 * Get priced repairs for a specific device model.
 * Supports ?modelId= or ?modelSlug=
 * Returns flat list + grouped-by-category structure for SelectRepairScreen.
 */
const getRepairsForModel = asyncHandler(async (req, res) => {
  let model = null;

  if (req.query.modelId) {
    model = await DeviceModel.findOne({ _id: req.query.modelId, isActive: true });
  } else if (req.query.modelSlug || req.params.modelSlug) {
    const slug = req.query.modelSlug || req.params.modelSlug;
    model = await DeviceModel.findOne({ slug, isActive: true });
  }

  if (!model) throw new ApiError(404, 'Device model not found. Provide modelId or modelSlug.');

  const categoryFilter = req.query.categoryId || req.query.categorySlug;
  const serviceQuery = { modelId: model._id, isActive: true };

  let categoryDoc = null;
  if (categoryFilter) {
    categoryDoc = await RepairCategory.findOne({
      isActive: true,
      $or: [{ _id: categoryFilter }, { slug: categoryFilter }],
    });
    if (categoryDoc) serviceQuery.categoryId = categoryDoc._id;
  }

  const services = await RepairService.find(serviceQuery)
    .populate('categoryId', 'title shortTitle slug icon sortOrder')
    .sort({ sortOrder: 1 });

  const grouped = {};
  services.forEach((svc) => {
    const cat = svc.categoryId;
    const key = cat?.slug || 'other';
    if (!grouped[key]) {
      grouped[key] = {
        category: cat,
        services: [],
      };
    }
    grouped[key].services.push(svc);
  });

  sendSuccess(res, {
    message: 'Repairs fetched for model',
    data: {
      model: {
        id: model._id,
        slug: model.slug,
        name: model.name,
        image: model.image,
      },
      grouped,
      services,
    },
  });
});

const getRepairById = asyncHandler(async (req, res) => {
  const repair = await RepairService.findOne({ _id: req.params.id, isActive: true })
    .populate('categoryId')
    .populate({
      path: 'modelId',
      populate: [{ path: 'brandId', select: 'name slug' }, { path: 'deviceTypeId', select: 'title slug' }],
    });

  if (!repair) throw new ApiError(404, 'Repair service not found');
  sendSuccess(res, { message: 'Repair fetched', data: repair });
});

module.exports = {
  getRepairCategories,
  getRepairsForModel,
  getRepairById,
};
