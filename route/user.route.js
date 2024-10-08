// /routes/user.route.js

import { Router } from "express";
import { createNewUser, forgotPassword, getDashboardData, getSearchHistory, loginUser, resetPassword, saveSearchHistory, verifyResetPasswordToken } from "../controllers/user.controller.js";
import { createUserValidation, loginValidation } from "../validators/userValidators.js";
import { requireAuth } from "../middleware/requireAuth.js";


const userRouter = Router();

// Route to register a new user
userRouter.post("/register", createUserValidation, createNewUser);

// Route to login a user
userRouter.post("/login", loginValidation, loginUser);

// Route to request a password reset
userRouter.post("/forgot-password", forgotPassword);

// Route to verify the reset password token (using GET, since it's a verification step)
userRouter.get("/verify-reset-password-token", verifyResetPasswordToken);

// Route to reset the password
userRouter.post("/reset-password", resetPassword);

// Route to get user dashboard data
userRouter.get("/dashboard", requireAuth, getDashboardData);

// Route to get a user's search history
userRouter.get("/search-history/:email", getSearchHistory);

// Route to save a search term to a user's search history
userRouter.post("/search-history/:email", saveSearchHistory);



export default userRouter;
