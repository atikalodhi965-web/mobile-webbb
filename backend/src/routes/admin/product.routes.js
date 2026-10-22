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
  'deviceTypeId',
]);

const attachProductImages = (req, res, next) => {
  if (req.files?.image?.[0]) req.file = req.files.image[0];
  if (req.files?.images) req.files = req.files.images;
  next();
};

const sanitizeProductBody = (req, res, next) => {
  const body = req.body;

  // Clean ObjectId references
  ['brandId', 'deviceTypeId'].forEach((f) => {
    if (body[f] === '' || body[f] === 'null' || body[f] === 'undefined' || !body[f]) {
      body[f] = null;
    }
  });

  // Clean numbers
  ['price', 'originalPrice', 'savings', 'sortOrder'].forEach((f) => {
    if (body[f] !== undefined && body[f] !== null) {
      if (body[f] === '' || Number.isNaN(Number(body[f]))) {
        body[f] = 0;
      } else {
        body[f] = Number(body[f]);
      }
    }
  });

  // Clean booleans
  ['isActive', 'isFeatured'].forEach((f) => {
    if (body[f] !== undefined) {
      body[f] = body[f] === true || body[f] === 'true';
    }
  });

  // Clean description: Mongoose expects { text: String, bullets: [{ title, text }] }
  if (typeof body.description === 'string') {
    try {
      body.description = JSON.parse(body.description);
    } catch {
      body.description = { text: body.description, bullets: [] };
    }
  }
  if (!body.description || typeof body.description !== 'object') {
    body.description = { text: '', bullets: [] };
  } else {
    if (typeof body.description.text !== 'string') {
      body.description.text = String(body.description.text || '');
    }
    if (!Array.isArray(body.description.bullets)) {
      body.description.bullets = [];
    }
  }

  // If descriptionBullets was passed separately
  if (body.descriptionBullets) {
    let bullets = body.descriptionBullets;
    if (typeof bullets === 'string') {
      try {
        bullets = JSON.parse(bullets);
      } catch {
        bullets = [];
      }
    }
    if (Array.isArray(bullets) && bullets.length > 0) {
      body.description.bullets = bullets;
    }
    delete body.descriptionBullets;
  }

  // Clean arrays
  ['colors', 'capacities', 'conditions', 'conditionPrices', 'stockByVariant', 'features', 'images'].forEach((f) => {
    if (typeof body[f] === 'string') {
      try {
        body[f] = JSON.parse(body[f]);
      } catch {
        if (['capacities', 'conditions', 'features'].includes(f) && body[f].trim()) {
          body[f] = body[f].split(',').map((s) => s.trim()).filter(Boolean);
        } else {
          body[f] = [];
        }
      }
    }
    if (!Array.isArray(body[f])) {
      body[f] = [];
    }
  });

  // Clean string fields
  ['tag', 'tagline', 'category', 'warranty', 'returns', 'brand'].forEach((f) => {
    if (body[f] === 'null' || body[f] === 'undefined') {
      body[f] = f === 'tag' ? null : '';
    } else if (body[f] === '' && f === 'tag') {
      body[f] = null;
    }
  });

  // Clean slug: if empty, delete so crudFactory generates it from name
  if (body.slug === '') {
    delete body.slug;
  }

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
  sanitizeProductBody,
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
  sanitizeProductBody,
  productAdmin.update
);
router.delete('/:id', productAdmin.remove);
router.patch('/:id/stock', updateStock);
router.patch('/:id/publish', togglePublish);

module.exports = router;
