// /config/database.config.js

import mongoose from "mongoose";
import { config } from "dotenv";
config();

const mongoose_URI = process.env.DB_URI;

// Ensure DB_URI is defined
if (!mongoose_URI) {
  console.error("Error: DB_URI environment variable is not defined.");
  process.exit(1); // Exit process with failure code
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoose_URI, {
      serverSelectionTimeoutMS: 5000, // This is still useful for setting the timeout
    });
    console.log("mongoose connected successfully 💾");
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure code
  }
};

export default connectDB;
