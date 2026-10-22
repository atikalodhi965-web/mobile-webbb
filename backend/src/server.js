const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`SAMZ backend running on http://localhost:${config.port}`);
      console.log(`API base: http://localhost:${config.port}/api/v1`);
      console.log(`Admin API: http://localhost:${config.port}/api/v1/admin`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
