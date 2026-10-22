const express = require('express');
const { setUploadFolder, upload } = require('../../middlewares/upload');
const parseJsonFields = require('../../middlewares/parseJsonFields');
const {
  repairCategoryAdmin,
  repairServiceAdmin,
  bulkCreateRepairServices,
  getRepairsByModel,
} = require('../../controllers/admin/repairController');

const router = express.Router();
const parseServiceFields = parseJsonFields(['features']);

// Repair Categories
router.get('/categories', repairCategoryAdmin.getAll);
router.get('/categories/:id', repairCategoryAdmin.getById);
router.post(
  '/categories',
  setUploadFolder('repairs'),
  upload.single('image'),
  repairCategoryAdmin.create
);
router.put(
  '/categories/:id',
  setUploadFolder('repairs'),
  upload.single('image'),
  repairCategoryAdmin.update
);
router.delete('/categories/:id', repairCategoryAdmin.remove);

// Repair Services (per device model)
router.get('/services', repairServiceAdmin.getAll);
router.get('/services/:id', repairServiceAdmin.getById);
router.post(
  '/services',
  setUploadFolder('models'),
  upload.single('image'),
  parseServiceFields,
  repairServiceAdmin.create
);
router.put(
  '/services/:id',
  setUploadFolder('models'),
  upload.single('image'),
  parseServiceFields,
  repairServiceAdmin.update
);
router.delete('/services/:id', repairServiceAdmin.remove);

router.post('/services/bulk', bulkCreateRepairServices);
router.get('/by-model/:modelId', getRepairsByModel);

module.exports = router;
