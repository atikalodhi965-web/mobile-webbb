const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(
  cors({
    origin: [config.clientUrl, config.adminUrl, 'https://mobile-webbb.vercel.app', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root route - ping to check if service is up
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running successfully!',
  });
});

// Health check route with DB state
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'SAMZ API is running',
    env: config.nodeEnv,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Database connection middleware ensures DB connection is established before route handlers run
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed: ' + error.message,
    });
  }
});

app.use('/api/v1', publicRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
