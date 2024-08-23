// /index.js

import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/database.config.js";

const PORT = process.env.PORT || 5500;

const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    server.listen(PORT, () => {
      console.log(`🟢 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`🔴 Server connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure code
  }
};

startServer();

