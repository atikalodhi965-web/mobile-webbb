const express = require('express');
const {
  getHeroSlides,
  getReviews,
  getFaqs,
  getPageContent,
  getProtection,
} = require('../../controllers/public/contentController');

const router = express.Router();

router.get('/hero-slides', getHeroSlides);
router.get('/reviews', getReviews);
router.get('/faqs', getFaqs);
router.get('/pages/:pageKey', getPageContent);
router.get('/protection', getProtection);

module.exports = router;
