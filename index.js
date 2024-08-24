// /index.js

import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/database.config.js";

const PORT = process.env.PORT || 5500;
const ENV = process.env.NODE_ENV || "development";
const APP_VERSION = process.env.APP_VERSION || "1.0.0";

const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    server.listen(PORT, () => {
      console.log(`🟢 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${ENV}`);
      console.log(`📦 Version: ${APP_VERSION}`);
      console.log(`🚀 Welcome to Weather API Server Side`);
      console.log(`🎯 Ready to handle requests`);
    });
  } catch (error) {
    console.error(`🔴 Server connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure code
  }
};

startServer();

