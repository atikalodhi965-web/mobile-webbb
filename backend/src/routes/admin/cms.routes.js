const express = require('express');
const { setUploadFolder, upload } = require('../../middlewares/upload');
const parseJsonFields = require('../../middlewares/parseJsonFields');
const {
  reviewAdmin,
  faqAdmin,
  heroSlideAdmin,
  getStore,
  upsertStore,
  discountAdmin,
  protectionAdmin,
  getAllPages,
  getPageByKey,
  upsertPage,
  deletePage,
} = require('../../controllers/admin/cmsController');

const router = express.Router();

// Reviews
router.get('/reviews', reviewAdmin.getAll);
router.post('/reviews', setUploadFolder('reviews'), upload.single('image'), reviewAdmin.create);
router.put('/reviews/:id', setUploadFolder('reviews'), upload.single('image'), reviewAdmin.update);
router.delete('/reviews/:id', reviewAdmin.remove);

// FAQs
router.get('/faqs', faqAdmin.getAll);
router.post('/faqs', faqAdmin.create);
router.put('/faqs/:id', faqAdmin.update);
router.delete('/faqs/:id', faqAdmin.remove);

// Hero slides
router.get('/hero-slides', heroSlideAdmin.getAll);
router.post('/hero-slides', setUploadFolder('cms'), upload.single('image'), heroSlideAdmin.create);
router.put('/hero-slides/:id', setUploadFolder('cms'), upload.single('image'), heroSlideAdmin.update);
router.delete('/hero-slides/:id', heroSlideAdmin.remove);

// Single store (edit the service centre — no multi-location CRUD)
router.get('/store', getStore);
router.put(
  '/store',
  setUploadFolder('cms'),
  upload.single('image'),
  parseJsonFields(['openingHours', 'timeSlots']),
  upsertStore
);

// Discounts
router.get('/discounts', discountAdmin.getAll);
router.post('/discounts', discountAdmin.create);
router.put('/discounts/:id', discountAdmin.update);
router.delete('/discounts/:id', discountAdmin.remove);

// Protection plans
router.get('/protection', protectionAdmin.getAll);
router.post('/protection', setUploadFolder('cms'), upload.single('image'), protectionAdmin.create);
router.put('/protection/:id', setUploadFolder('cms'), upload.single('image'), protectionAdmin.update);
router.delete('/protection/:id', protectionAdmin.remove);

// Page CMS
router.get('/pages', getAllPages);
router.get('/pages/:pageKey', getPageByKey);
router.put('/pages/:pageKey', setUploadFolder('cms'), upload.single('image'), upsertPage);
router.post('/pages', setUploadFolder('cms'), upload.single('image'), upsertPage);
router.delete('/pages/:pageKey', deletePage);

module.exports = router;
