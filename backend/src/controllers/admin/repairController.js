const RepairCategory = require('../../models/RepairCategory');
const RepairService = require('../../models/RepairService');
const DeviceModel = require('../../models/DeviceModel');
const createCrudController = require('../../services/crudFactory');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const toSlug = require('../../utils/slugify');

const repairCategoryAdmin = createCrudController(RepairCategory, {
  resourceName: 'RepairCategory',
  slugSource: 'title',
  searchFields: ['title', 'shortTitle', 'slug'],
});

const repairServiceAdmin = createCrudController(RepairService, {
  resourceName: 'RepairService',
  slugSource: 'title',
  searchFields: ['title', 'slug', 'description'],
  populate: [
    { path: 'modelId', select: 'name slug brandId deviceTypeId' },
    { path: 'categoryId', select: 'title slug icon' },
  ],
});

/**
 * Bulk-create repair services for one model (admin convenience).
 * Body: { modelId, services: [{ categoryId, title, price, ... }] }
 */
const bulkCreateRepairServices = asyncHandler(async (req, res) => {
  const { modelId, services } = req.body;

  if (!modelId || !Array.isArray(services) || !services.length) {
    throw new ApiError(400, 'modelId and services[] are required.');
  }

  const model = await DeviceModel.findById(modelId);
  if (!model) throw new ApiError(404, 'Device model not found.');

  const docs = services.map((s, index) => ({
    modelId,
    categoryId: s.categoryId,
    slug: s.slug || toSlug(s.title),
    title: s.title,
    description: s.description || '',
    price: s.price,
    currency: s.currency || 'GBP',
    warranty: s.warranty || '',
    repairTime: s.repairTime || '',
    note: s.note || '',
    icon: s.icon || '',
    partType: s.partType || 'standard',
    features: s.features || [],
    sortOrder: s.sortOrder ?? index,
    isActive: s.isActive !== false,
  }));

  const created = await RepairService.insertMany(docs, { ordered: false }).catch(async (err) => {
    if (err.writeErrors) {
      const inserted = err.insertedDocs || [];
      return inserted;
    }
    throw err;
  });

  sendSuccess(res, {
    statusCode: 201,
    message: `Created repair services for ${model.name}`,
    data: created,
  });
});

/**
 * List all repairs for a model, grouped by category (admin preview).
 */
const getRepairsByModel = asyncHandler(async (req, res) => {
  const { modelId } = req.params;

  const services = await RepairService.find({ modelId })
    .populate('categoryId')
    .sort({ sortOrder: 1 });

  const grouped = {};
  services.forEach((svc) => {
    const key = svc.categoryId?.slug || 'other';
    if (!grouped[key]) {
      grouped[key] = {
        category: svc.categoryId,
        services: [],
      };
    }
    grouped[key].services.push(svc);
  });

  sendSuccess(res, {
    message: 'Repairs for model',
    data: { modelId, grouped, flat: services },
  });
});

module.exports = {
  repairCategoryAdmin,
  repairServiceAdmin,
  bulkCreateRepairServices,
  getRepairsByModel,
};
