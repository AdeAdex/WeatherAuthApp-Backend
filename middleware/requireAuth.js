import { verifyToken } from "../utils/lib/userJwtUtils.js";

export const requireAuth = (req, res, next) => {
  const BASE_URL  = process.env.BASE_URL
  // console.log(BASE_URL)
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Bearer token'

  if (!token) {
    // If no token is found, redirect to the homepage with a message in the query
    return res.redirect(`${BASE_URL}?message=Unauthorized access. Please log in.`);
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    // If the token is invalid or expired, redirect to the homepage with a message
    return res.redirect(`${BASE_URL}?message=Token has expired or is invalid. Please log in.`);
  }

  // If the token is valid, attach the decoded information to the request object
  req.user = decodedToken;

  // Move to the next middleware or route handler
  next();
};
