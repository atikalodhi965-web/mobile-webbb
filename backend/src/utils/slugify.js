const slugifyLib = require('slugify');

const toSlug = (value) =>
  slugifyLib(String(value || ''), {
    lower: true,
    strict: true,
    trim: true,
  });

module.exports = toSlug;
