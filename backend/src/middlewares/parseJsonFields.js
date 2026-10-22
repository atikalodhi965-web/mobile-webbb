/**
 * When using multipart/form-data, nested objects/arrays arrive as JSON strings.
 * This middleware parses known fields so Mongoose receives proper types.
 */
const parseJsonFields = (fields = []) => (req, res, next) => {
  fields.forEach((field) => {
    if (req.body[field] !== undefined && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        // leave as string if not valid JSON
      }
    }
  });

  // booleans / numbers commonly sent as strings in form-data
  ['isActive', 'isFeatured', 'isPublished', 'availableForBooking', 'marketingOptIn'].forEach(
    (field) => {
      if (req.body[field] === 'true') req.body[field] = true;
      if (req.body[field] === 'false') req.body[field] = false;
    }
  );

  ['price', 'originalPrice', 'savings', 'priceFrom', 'sortOrder', 'stock', 'value'].forEach(
    (field) => {
      if (req.body[field] !== undefined && req.body[field] !== '' && !Number.isNaN(Number(req.body[field]))) {
        req.body[field] = Number(req.body[field]);
      }
    }
  );

  next();
};

module.exports = parseJsonFields;
