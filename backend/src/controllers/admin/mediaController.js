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
