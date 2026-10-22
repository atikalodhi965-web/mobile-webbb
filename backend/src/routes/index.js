/**
 * Route aggregator reference:
 *  Public  -> /api/v1/*
 *  Admin   -> /api/v1/admin/*
 */
module.exports = {
  publicRoutes: require('./public'),
  adminRoutes: require('./admin'),
};
