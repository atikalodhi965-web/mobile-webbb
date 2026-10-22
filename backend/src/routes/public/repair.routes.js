const express = require('express');
const {
  getRepairCategories,
  getRepairsForModel,
  getRepairById,
} = require('../../controllers/public/repairController');

const router = express.Router();

router.get('/categories', getRepairCategories);
router.get('/', getRepairsForModel);
router.get('/model/:modelSlug', getRepairsForModel);
router.get('/:id', getRepairById);

module.exports = router;
