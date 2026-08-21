import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start Express server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[PrepForge API] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();
