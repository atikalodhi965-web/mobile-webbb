const express = require('express');
const { setUploadFolder, upload } = require('../../middlewares/upload');
const parseJsonFields = require('../../middlewares/parseJsonFields');
const {
  productAdmin,
  updateStock,
  togglePublish,
} = require('../../controllers/admin/productController');

const router = express.Router();

const productJsonFields = parseJsonFields([
  'colors',
  'capacities',
  'conditions',
  'conditionPrices',
  'stockByVariant',
  'description',
  'features',
  'images',
  'brandId',
]);

const attachProductImages = (req, res, next) => {
  if (req.files?.image?.[0]) req.file = req.files.image[0];
  if (req.files?.images) req.files = req.files.images;
  next();
};

router.get('/', productAdmin.getAll);
router.get('/:id', productAdmin.getById);
router.post(
  '/',
  setUploadFolder('products'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 12 },
  ]),
  attachProductImages,
  productJsonFields,
  productAdmin.create
);
router.put(
  '/:id',
  setUploadFolder('products'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 12 },
  ]),
  attachProductImages,
  productJsonFields,
  productAdmin.update
);
router.delete('/:id', productAdmin.remove);
router.patch('/:id/stock', updateStock);
router.patch('/:id/publish', togglePublish);

module.exports = router;
