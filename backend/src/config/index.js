require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET || 'samz_fallback_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
  adminSeed: {
    name: process.env.ADMIN_NAME || 'SAMZ Admin',
    email: process.env.ADMIN_EMAIL || 'admin@samz.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  },
};

module.exports = config;
