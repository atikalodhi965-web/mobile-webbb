const express = require('express');
const {
  getCurrentStore,
  getStoreSlots,
} = require('../../controllers/public/storeController');

const router = express.Router();

router.get('/', getCurrentStore);
router.get('/current', getCurrentStore);
router.get('/slots', getStoreSlots);

module.exports = router;
