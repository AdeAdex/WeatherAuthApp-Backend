// /controllers/user.controller.js

import axios from "axios";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model.js";
import tryCatchLib from "../utils/lib/tryCatch.lib.js";
import { errorResponse, successResponse } from "../utils/lib/response.lib.js";
import { comparePasswords, hashPassword } from "../utils/lib/bcryptUtils.js";
import { sendResetPasswordEmail, sendWelcomeEmail } from "../utils/lib/userEmailUtils.js";
import { generateToken } from "../utils/lib/userJwtUtils.js";

/**
 * Controller function to handle user registration.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */

const CURRENT_WEATHER_API_KEY = process.env.CURRENT_WEATHER_API_KEY;
const FORECAST_API_KEY = process.env.FORECAST_API_KEY;

export const createNewUser = tryCatchLib(async (req, res) => {
  const { firstName, lastName, email, city, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return errorResponse(
        res,
        "Email already exists with us",
        StatusCodes.CONFLICT
      );
    }

    // Fetch current weather and forecast data concurrently
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${CURRENT_WEATHER_API_KEY}`
      ),
      axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${FORECAST_API_KEY}`
      ),
    ]);

    // Extract data from responses
    const currentWeather = currentWeatherResponse.data;
    const forecastList = forecastResponse.data.list;

    // Extract and attach icon URL to current weather
    const currentWeatherIconId = currentWeather.weather[0].icon;
    currentWeather.iconUrl = `https://openweathermap.org/img/wn/${currentWeatherIconId}@2x.png`;

    // Attach icon URL to each forecast entry
    const forecastWithIcons = forecastList.map((forecast) => {
      forecast.weather = forecast.weather.map((weather) => ({
        ...weather,
        iconUrl: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
      }));
      return forecast;
    });

    // Hash the user's password
    const hashedPassword = await hashPassword(password);

    // Combine user information with fetched weather data
    const userInfo = {
      firstName,
      lastName,
      email,
      city,
      password: hashedPassword,
      weatherData: {
        currentWeather,
        forecast: forecastWithIcons,
        weatherMapUrl: `https://tile.openweathermap.org/map/clouds/10/10/10.png?appid=${CURRENT_WEATHER_API_KEY}`,
      },
    };

    // Save the new user to the database
    const newUser = await UserModel.create(userInfo);

    // Send a welcome email to the user
    await sendWelcomeEmail(email, firstName);

    // Respond with a success message
    return successResponse(
      res,
      "Registration successful",
//       {
//         user: {
//           id: newUser._id,
//           email: newUser.email,
//           firstName: newUser.firstName,
//           lastName: newUser.lastName,
//           city: newUser.city,
//           weatherData: newUser.weatherData,
//         },
//       },
      StatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return errorResponse(
      res,
      "Failed to create user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

/**
 * Controller function to handle user login.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */

export const loginUser = tryCatchLib(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    console.log("User not found");
    return errorResponse(
      res,
      "Invalid email or password",
      StatusCodes.UNAUTHORIZED
    );
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    console.log("Invalid password");
    return errorResponse(
      res,
      "Invalid email or password",
      StatusCodes.UNAUTHORIZED
    );
  }

  const token = generateToken({ email: user.email });

  return successResponse(
    res,
    "Login successful",
    {
      token,
      user: {
        id: user._id,
        // email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        weatherData: user.weatherData,
      },
    },
    StatusCodes.OK
  );
});


/**
 * Controller function to handle password reset request.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */

export const forgotPassword = tryCatchLib(async (req, res) => {
        const { email } = req.body;
      
        try {
          // Find user by email
          const user = await UserModel.findOne({ email });
      
          if (!user) {
            console.log("User not found");
            return errorResponse(
              res,
              "We couldn't find an account associated with this email address.",
              StatusCodes.NOT_FOUND
            );
          }
      
          // Generate reset password token using JWT
          const resetToken = generateToken({ email: user.email });
      
          // Store reset token and expiration time in the database
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpires = Date.now() + 600000; // Token expiry time (10 minutes)
          await user.save();
      
          // Generate reset password link
          const resetLink = `${process.env.BASE_URL}/resetPassword?token=${resetToken}`;
      
          // Send reset password email
          await sendResetPasswordEmail(email, resetLink, user.firstName);
      
          return successResponse(
            res,
            "Reset password email sent",
            StatusCodes.OK
          );
        } catch (error) {
          console.error("Error during password reset request:", error);
          return errorResponse(
            res,
            "Internal server error",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
      });
