const Product = require('../../models/Product');
const createCrudController = require('../../services/crudFactory');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const productAdmin = createCrudController(Product, {
  resourceName: 'Product',
  slugSource: 'name',
  searchFields: ['name', 'slug', 'brand', 'category', 'tagline'],
  populate: ['brandId', 'deviceTypeId'],
});

const updateStock = asyncHandler(async (req, res) => {
  const { stockByVariant } = req.body;
  if (!Array.isArray(stockByVariant)) {
    throw new ApiError(400, 'stockByVariant array is required.');
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stockByVariant },
    { new: true, runValidators: true }
  );

  if (!product) throw new ApiError(404, 'Product not found');

  sendSuccess(res, { message: 'Stock updated', data: product });
});

const togglePublish = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  product.isActive = req.body.isActive !== undefined ? !!req.body.isActive : !product.isActive;
  await product.save();

  sendSuccess(res, {
    message: `Product ${product.isActive ? 'published' : 'unpublished'}`,
    data: product,
  });
});

module.exports = { productAdmin, updateStock, togglePublish };
