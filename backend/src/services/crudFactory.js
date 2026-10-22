const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const toSlug = require('../utils/slugify');

/**
 * Builds standard admin CRUD handlers for a Mongoose model.
 */
const createCrudController = (Model, options = {}) => {
  const {
    resourceName = Model.modelName,
    slugField = 'slug',
    slugSource = 'name',
    defaultSort = { sortOrder: 1, createdAt: -1 },
    populate = [],
    searchFields = ['name', 'title', 'slug'],
  } = options;

  const getAll = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 50,
      search,
      isActive,
      sort,
      ...filters
    } = req.query;

    const query = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && !['page', 'limit', 'search', 'sort'].includes(key)) {
        query[key] = value;
      }
    });

    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    if (search) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    let dbQuery = Model.find(query).sort(sort || defaultSort).skip(skip).limit(limitNum);
    populate.forEach((p) => {
      dbQuery = dbQuery.populate(p);
    });

    const [items, total] = await Promise.all([
      dbQuery,
      Model.countDocuments(query),
    ]);

    sendSuccess(res, {
      message: `${resourceName} list fetched`,
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

  const getById = asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    populate.forEach((p) => {
      query = query.populate(p);
    });
    const item = await query;
    if (!item) throw new ApiError(404, `${resourceName} not found`);
    sendSuccess(res, { message: `${resourceName} fetched`, data: item });
  });

  const create = asyncHandler(async (req, res) => {
    const body = { ...req.body };

    if (slugField && !body[slugField] && body[slugSource]) {
      body[slugField] = toSlug(body[slugSource]);
    }

    if (req.file) {
      body.image = `/uploads/${req.uploadFolder || 'misc'}/${req.file.filename}`;
    }

    if (req.files?.length) {
      body.images = req.files.map(
        (f) => `/uploads/${req.uploadFolder || 'misc'}/${f.filename}`
      );
      if (!body.image && body.images[0]) body.image = body.images[0];
    }

    const item = await Model.create(body);
    sendSuccess(res, {
      statusCode: 201,
      message: `${resourceName} created`,
      data: item,
    });
  });

  const update = asyncHandler(async (req, res) => {
    const body = { ...req.body };

    if (slugField && body[slugSource] && !body[slugField]) {
      body[slugField] = toSlug(body[slugSource]);
    }

    if (req.file) {
      body.image = `/uploads/${req.uploadFolder || 'misc'}/${req.file.filename}`;
    }

    if (req.files?.length) {
      body.images = req.files.map(
        (f) => `/uploads/${req.uploadFolder || 'misc'}/${f.filename}`
      );
    }

    const item = await Model.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!item) throw new ApiError(404, `${resourceName} not found`);
    sendSuccess(res, { message: `${resourceName} updated`, data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, `${resourceName} not found`);
    sendSuccess(res, { message: `${resourceName} deleted`, data: item });
  });

  return { getAll, getById, create, update, remove };
};

module.exports = createCrudController;
