const express = require('express');
const {
  getProducts,
  getProductBySlug,
} = require('../../controllers/public/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:slugOrId', getProductBySlug);

module.exports = router;
