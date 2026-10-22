const express = require('express');
const { setUploadFolder, upload } = require('../../middlewares/upload');
const parseJsonFields = require('../../middlewares/parseJsonFields');
const {
  deviceTypeAdmin,
  brandAdmin,
  deviceModelAdmin,
} = require('../../controllers/admin/catalogController');

const router = express.Router();
const parseBrandFields = parseJsonFields(['deviceTypeIds']);
const parseModelFields = parseJsonFields(['features', 'images']);

// Device Types
router.get('/device-types', deviceTypeAdmin.getAll);
router.get('/device-types/:id', deviceTypeAdmin.getById);
router.post(
  '/device-types',
  setUploadFolder('cms'),
  upload.single('image'),
  deviceTypeAdmin.create
);
router.put(
  '/device-types/:id',
  setUploadFolder('cms'),
  upload.single('image'),
  deviceTypeAdmin.update
);
router.delete('/device-types/:id', deviceTypeAdmin.remove);

// Brands
router.get('/brands', brandAdmin.getAll);
router.get('/brands/:id', brandAdmin.getById);
router.post(
  '/brands',
  setUploadFolder('brands'),
  upload.single('image'),
  parseBrandFields,
  brandAdmin.create
);
router.put(
  '/brands/:id',
  setUploadFolder('brands'),
  upload.single('image'),
  parseBrandFields,
  brandAdmin.update
);
router.delete('/brands/:id', brandAdmin.remove);

// Device Models (repairable products hierarchy leaf)
router.get('/models', deviceModelAdmin.getAll);
router.get('/models/:id', deviceModelAdmin.getById);
router.post(
  '/models',
  setUploadFolder('models'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  (req, res, next) => {
    if (req.files?.image?.[0]) req.file = req.files.image[0];
    if (req.files?.images) req.files = req.files.images;
    next();
  },
  parseModelFields,
  deviceModelAdmin.create
);
router.put(
  '/models/:id',
  setUploadFolder('models'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  (req, res, next) => {
    if (req.files?.image?.[0]) req.file = req.files.image[0];
    if (req.files?.images) req.files = req.files.images;
    next();
  },
  parseModelFields,
  deviceModelAdmin.update
);
router.delete('/models/:id', deviceModelAdmin.remove);

module.exports = router;
