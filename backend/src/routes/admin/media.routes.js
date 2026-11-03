const express = require('express');
const { setUploadFolder, upload } = require('../../middlewares/upload');
const { uploadSingle, uploadMultiple } = require('../../controllers/admin/mediaController');

const router = express.Router();

router.post(
  '/upload',
  (req, res, next) => {
    req.uploadFolder = req.query.folder || req.body.folder || 'misc';
    next();
  },
  upload.single('image'),
  uploadSingle
);

router.post(
  '/upload-multiple',
  (req, res, next) => {
    req.uploadFolder = req.query.folder || req.body.folder || 'misc';
    next();
  },
  upload.array('images', 12),
  uploadMultiple
);

module.exports = router;
