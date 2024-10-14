// /controllers/user.controller.js

import axios from "axios";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model.js";
import tryCatchLib from "../utils/lib/tryCatch.lib.js";
import { errorResponse, successResponse } from "../utils/lib/response.lib.js";
import { comparePasswords, hashPassword } from "../utils/lib/bcryptUtils.js";
import {
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from "../utils/lib/userEmailUtils.js";
import { generateToken, verifyToken } from "../utils/lib/userJwtUtils.js";

/**
 * Controller function to handle user registration.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */

const CURRENT_WEATHER_API_KEY = process.env.CURRENT_WEATHER_API_KEY;
const FORECAST_API_KEY = process.env.FORECAST_API_KEY;
const AIR_POLLUTION_API_KEY = process.env.AIR_POLLUTION_API_KEY; 

// const unit = "metric"

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
    // const [currentWeatherResponse, forecastResponse] = await Promise.all([
    //   axios.get(
    //     `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    //       city
    //     )}&appid=${CURRENT_WEATHER_API_KEY}&units=${unit}`
    //   ),
    //   axios.get(
    //     `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    //       city
    //     )}&appid=${FORECAST_API_KEY}&units=${unit}`
    //   ),
    // ]);

    // // Extract data from responses
    // const currentWeather = currentWeatherResponse.data;
    // const forecastList = forecastResponse.data.list;

    // // Extract and attach icon URL to current weather
    // const currentWeatherIconId = currentWeather.weather[0].icon;
    // currentWeather.iconUrl = `https://openweathermap.org/img/wn/${currentWeatherIconId}@2x.png`;

    // // Attach icon URL to each forecast entry
    // const forecastWithIcons = forecastList.map((forecast) => {
    //   forecast.weather = forecast.weather.map((weather) => ({
    //     ...weather,
    //     iconUrl: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
    //   }));
    //   return forecast;
    // });

    // Hash the user's password
    const hashedPassword = await hashPassword(password);

    // Combine user information with fetched weather data
    const userInfo = {
      firstName,
      lastName,
      email,
      city,
      password: hashedPassword,
      // weatherData: {
      //   currentWeather,
      //   forecast: forecastWithIcons,
      //   weatherMapUrl: `https://tile.openweathermap.org/map/clouds/10/10/10.png?appid=${CURRENT_WEATHER_API_KEY}`,
      // },
    };

    // Save the new user to the database
    const newUser = await UserModel.create(userInfo);

    // Send a welcome email to the user
    await sendWelcomeEmail(email, firstName);

    // Respond with a success message
    return successResponse(
      res,
      "Registration successful",
            {
              user: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                city: newUser.city,
                // weatherData: newUser.weatherData,
              },
            },
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
        // searchHistory: user.searchHistory,
        // weatherData: user.weatherData,
      },
    },
    StatusCodes.OK
  );
});

/**
 * Controller function to handle user dashboard.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */


export const getDashboardData = async (req, res) => {
  // const token = req.query.token;

  // if (!token) {
  //   return errorResponse(res, "Token is required", StatusCodes.BAD_REQUEST);
  // }
  
  const { email } = req.user;

  try {
    // const decodedToken = await verifyToken(token);

    // if (!decodedToken) {
    //   return errorResponse(res, "Invalid token or token has expired", StatusCodes.UNAUTHORIZED);
    // }

    // const currentTime = Date.now() / 1000;
    // if (decodedToken.exp < currentTime) {
    //   return errorResponse(res, "Token has expired", StatusCodes.UNAUTHORIZED);
    // }
    

    // const email = decodedToken.email;

    const user = await UserModel.findOne({ email }).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
    }

    let { city } = req.body;
    if (!city || city === undefined) {
      city = user.city;
    }

    if (!city) {
      return errorResponse(res, "City not provided or not found in user data", StatusCodes.BAD_REQUEST);
    }


    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${CURRENT_WEATHER_API_KEY}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${FORECAST_API_KEY}&units=metric`),
    ]);

    const currentWeather = currentWeatherResponse.data;
    const forecastList = forecastResponse.data.list;

    const { lat, lon } = currentWeather.coord;
    const airPollutionResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AIR_POLLUTION_API_KEY}`
    );
    const airPollutionData = airPollutionResponse.data;

    currentWeather.iconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    const forecastWithIcons = forecastList.map((forecast) => {
      forecast.weather = forecast.weather.map((weather) => ({
        ...weather,
        iconUrl: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
      }));
      return forecast;
    });

    const weatherData = {
      currentWeather,
      forecast: forecastWithIcons,
      airPollution: airPollutionData,
      weatherMapUrl: `https://tile.openweathermap.org/map/clouds/10/10/10.png?appid=${CURRENT_WEATHER_API_KEY}`,
    };

    user.weatherData = weatherData;

    // If the searched city is different from the user's default city, save it in the search history
    if (city !== user.city) {
      const weatherSearchRecord = {
        city,
        country: currentWeather.sys.country,
        weatherData: {
          windSpeed: currentWeather.wind.speed,
          humidity: currentWeather.main.humidity,
          pressure: currentWeather.main.pressure,
          clouds: currentWeather.clouds.all,
          temperature: currentWeather.main.temp,
        },
      };
      user.weatherSearchHistory.push(weatherSearchRecord);
    }

    await user.save();

    const userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      city: user.city,
    };

    return successResponse(res, "Dashboard data retrieved successfully", {
      // userInfo,
      // weatherData,
      weatherSearchHistory: user.weatherSearchHistory,
    });
  } catch (error) {
    console.error("Error retrieving dashboard data:", error);
    return errorResponse(
      res,
      `An error occurred while retrieving dashboard data: ${error.message}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};





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

    return successResponse(res, "Reset password email sent", StatusCodes.OK);
  } catch (error) {
    console.error("Error during password reset request:", error);
    return errorResponse(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

/**
 * Controller function to handle verifying reset password token.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */
export const verifyResetPasswordToken = tryCatchLib(async (req, res) => {
  // const { token } = req.body;
  const { token } = req.query;

  if (!token) {
    return errorResponse(res, "Token is required", StatusCodes.BAD_REQUEST);
  }

  try {
    // Verify the token
    const decodedToken = await verifyToken(token);
    //   console.log("decoded token",decodedToken)

    if (!decodedToken) {
      return errorResponse(
        res,
        "Invalid token or token has expired",
        StatusCodes.UNAUTHORIZED
      );
    }

    // Check if the token has expired
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    //   console.log("time", currentTime)
    if (decodedToken.exp < currentTime) {
      return errorResponse(res, "Token has expired", StatusCodes.UNAUTHORIZED);
    }

    // Find the user associated with the token
    const user = await UserModel.findOne({ resetPasswordToken: token });

    if (!user) {
      return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
    }

    // Token is valid, return success response with user data
    return successResponse(
      res,
      "Token is valid",
      {
        user: {
          id: user._id,
          firstName: user.firstName,
        },
      },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return errorResponse(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

/**
 * Controller function to reset the user's password.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */
export const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { password } = req.body;

    //     console.log("token", token);
    //     console.log("password", password);

    if (!token) {
      return errorResponse(res, "Token is missing", StatusCodes.BAD_REQUEST);
    }

    if (!password) {
      return errorResponse(
        res,
        "Password is required",
        StatusCodes.BAD_REQUEST
      );
    }

    // Verify the token
    //   const decodedToken = jwt.verifyToken(token, process.env.JWT_SECRET);
    const decodedToken = await verifyToken(token);
    //       console.log("decoded token",decodedToken)

    if (!decodedToken) {
      return errorResponse(
        res,
        "Invalid token or token has expired",
        StatusCodes.UNAUTHORIZED
      );
    }

    // Check if the token has expired
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    //   console.log("time", currentTime)
    if (decodedToken.exp < currentTime) {
      return errorResponse(res, "Token has expired", StatusCodes.UNAUTHORIZED);
    }

    // Find the user by email from the decoded token
    const user = await UserModel.findOne({ email: decodedToken.email });
    if (!user) {
      return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
    }

    const isSamePassword = await comparePasswords(password, user.password);
    if (isSamePassword) {
      //       console.log("New password matches existing password");
      return errorResponse(
        res,
        "New password cannot be the same as the existing password",
        StatusCodes.BAD_REQUEST
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update the user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return successResponse(res, "Password reset successfully", StatusCodes.OK);
  } catch (error) {
    console.error("Error during password reset:", error);
    return errorResponse(
      res,
      "Failed to reset password",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};





/**
 * Controller function to save a search term to a user's search history.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */
export const saveSearchHistory = async (req, res) => {
  const { email } = req.params; // Assuming the user's email is passed as a URL parameter
  const  searchTerm  = req.body.query; // The search term to save

 
  if (!searchTerm) {
    return errorResponse(res, "Search term is required", StatusCodes.BAD_REQUEST);
  }

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
    }

    // Add the search term and timestamp to the user's search history
    user.searchHistory.push({
      query: searchTerm,
      searchedAt: new Date(), // Automatically sets the current date and time
    });

    // Save the updated user document
    await user.save();

    return successResponse(
      res,
      "Search term saved successfully",
      { searchHistory: user.searchHistory },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error saving search term:", error);
    return errorResponse(
      res,
      "Failed to save search term",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};



/**
 * Controller function to get the search history of a user.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */
export const getSearchHistory = async (req, res) => {
  const { email } = req.params; // Assuming the user's email is passed as a URL parameter

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
    }

    // Return the user's search history
    return successResponse(
      res,
      "Search history retrieved successfully",
      { searchHistory: user.searchHistory },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error retrieving search history:", error);
    return errorResponse(
      res,
      "Failed to retrieve search history",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
