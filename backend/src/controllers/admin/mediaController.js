const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const ApiError = require('../../utils/ApiError');

const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file uploaded.');

  const folder = req.uploadFolder || 'misc';
  const url = `/uploads/${folder}/${req.file.filename}`;

  sendSuccess(res, {
    statusCode: 201,
    message: 'Image uploaded',
    data: {
      url,
      filename: req.file.filename,
      folder,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

const listMedia = asyncHandler(async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const baseDir = path.join(process.cwd(), 'uploads');
  const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(full));
      } else {
        const rel = path.relative(baseDir, full).replace(/\\\\/g, '/');
        results.push({
          url: `/uploads/${rel}`,
          name: file,
          size: stat.size,
          uploaded: stat.birthtime,
          folder: path.dirname(rel),
        });
      }
    });
    return results;
  };
  const items = walk(baseDir);
  sendSuccess(res, { message: 'Media files fetched', data: { items } });
});

const listMedia = asyncHandler(async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const baseDir = path.join(process.cwd(), 'uploads');
  const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(full));
      } else {
        const rel = path.relative(baseDir, full).replace(/\\\\/g, '/');
        results.push({
          url: `/uploads/${rel}`,
          name: file,
          size: stat.size,
          uploaded: stat.birthtime,
          folder: path.dirname(rel),
        });
      }
    });
    return results;
  };
  const items = walk(baseDir);
  sendSuccess(res, { message: 'Media files fetched', data: { items } });
});

const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'No image files uploaded.');

  const folder = req.uploadFolder || 'misc';
  const files = req.files.map((f) => ({
    url: `/uploads/${folder}/${f.filename}`,
    filename: f.filename,
    mimetype: f.mimetype,
    size: f.size,
  }));

  sendSuccess(res, {
    statusCode: 201,
    message: 'Images uploaded',
    data: files,
  });
});

module.exports = { uploadSingle, uploadMultiple };
