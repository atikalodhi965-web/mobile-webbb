/**
 * When using multipart/form-data, nested objects/arrays arrive as JSON strings.
 * This middleware parses known fields so Mongoose receives proper types.
 */
const parseJsonFields = (fields = []) => (req, res, next) => {
  fields.forEach((field) => {
    if (req.body[field] !== undefined && typeof req.body[field] === 'string') {
      const trimmed = req.body[field].trim();
      if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
        if (['brandId', 'deviceTypeId', 'deviceModelId', 'categoryId', 'repairCategoryId', 'storeId', 'userId'].includes(field)) {
          req.body[field] = null;
        } else if (['colors', 'capacities', 'conditions', 'conditionPrices', 'stockByVariant', 'features', 'images'].includes(field)) {
          req.body[field] = [];
        }
      } else {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {
          // leave as string if not valid JSON
        }
      }
    }
  });

  // booleans commonly sent as strings in form-data
  ['isActive', 'isFeatured', 'isPublished', 'availableForBooking', 'marketingOptIn'].forEach(
    (field) => {
      if (req.body[field] === 'true') req.body[field] = true;
      if (req.body[field] === 'false') req.body[field] = false;
    }
  );

  // ObjectIds sent as empty strings or "null" or "undefined" should be null
  ['brandId', 'deviceTypeId', 'deviceModelId', 'categoryId', 'repairCategoryId', 'storeId', 'userId'].forEach((field) => {
    if (req.body[field] === '' || req.body[field] === 'null' || req.body[field] === 'undefined') {
      req.body[field] = null;
    }
  });

  ['price', 'originalPrice', 'savings', 'priceFrom', 'sortOrder', 'stock', 'value'].forEach(
    (field) => {
      if (req.body[field] !== undefined) {
        if (req.body[field] === '' || req.body[field] === null) {
          if (['originalPrice', 'savings', 'sortOrder', 'stock'].includes(field)) {
            req.body[field] = 0;
          } else {
            delete req.body[field];
          }
        } else if (!Number.isNaN(Number(req.body[field]))) {
          req.body[field] = Number(req.body[field]);
        }
      }
    }
  );

  next();
};

module.exports = parseJsonFields;
