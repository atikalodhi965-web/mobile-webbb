const express = require('express');
const {
  getDeviceTypes,
  getBrands,
  getBrandBySlug,
  getModels,
  getModelBySlug,
  searchCatalog,
} = require('../../controllers/public/catalogController');

const router = express.Router();

router.get('/device-types', getDeviceTypes);
router.get('/search', searchCatalog);
router.get('/brands', getBrands);
router.get('/brands/:slug', getBrandBySlug);
router.get('/models', getModels);
router.get('/models/:slug', getModelBySlug);

module.exports = router;
