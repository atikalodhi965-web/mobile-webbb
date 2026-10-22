const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is missing. Set it in your .env file.');
  }

  const conn = await mongoose.connect(config.mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
