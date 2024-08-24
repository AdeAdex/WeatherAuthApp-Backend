//  /app.js

import express from "express";
import morgan from "morgan";
import cors from "cors";
import expressSession from "express-session";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "./utils/lib/response.lib.js";
import cookieParser from "cookie-parser";
import route from "./route/index.js";
import helmet from "helmet"; // Import helmet for security

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"], // Update with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

// Use middlewares
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.use(morgan("dev")); // Log HTTP requests to console for development
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Use helmet for setting secure HTTP headers
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "fallbackSecret", // Use environment variable for session secret
    resave: false,
    saveUninitialized: false,
  })
);

// Define API routes
app.use("/api", route);

// Index route
// Index route
app.get("/", (_req, res) => {
  const responseMessage = `
    Welcome to the Weather API Server.
    Version: ${process.env.APP_VERSION || "1.0.0"}
    Environment: ${process.env.NODE_ENV || "development"}
    This API provides weather data and forecasts for various locations.
    Developed by Adex.
    Please refer to the documentation for available endpoints and usage.
  `;
  successResponse(res, responseMessage, StatusCodes.OK);
});


// Catch 404 errors and forward them to error handler
app.use((_req, _res, next) => {
  const error = new Error("Not Found");
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

// Error handler function
app.use((error, _req, res, _next) => {
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
