// utils/userJwtUtils.js
import jwt from "jsonwebtoken";

// JWT secret keys and expiration durations


/**
 * Function to generate a JWT token for authentication
 * Generates a JWT token with the provided payload.
 * @param {Object} payload The payload to be encoded in the JWT token.
 * @returns {string} The generated JWT token.
 */

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LASTED_FOR });
};




/**
 * Function to verify JWT token when user is accessing the Dashboard
 * Verifies the validity of a JWT token.
 * @param {string} token The JWT token to be verified.
 * @returns {Object|null} The decoded payload if the token is valid, null otherwise.
 */

export const verifyToken = (token) => {
        // console.log(" jwt token", token)
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("jwt decodedToken", decodedToken)
    return decodedToken;
  } catch (error) {
    return null; // Token verification failed
  }
};