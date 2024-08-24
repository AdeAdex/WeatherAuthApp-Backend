// /routes/user.route.js

import { Router } from "express";
import { createNewUser, forgotPassword, getDashboardData, loginUser, resetPassword, verifyResetPasswordToken } from "../controllers/user.controller.js";
import { createUserValidation, loginValidation } from "../validators/userValidators.js";


const userRouter = Router();

// Route to register a new user
userRouter.post("/register", createUserValidation, createNewUser);

// Route to login a user
userRouter.post("/login", loginValidation, loginUser);

// Route to request a password reset
userRouter.post("/forgot-password", forgotPassword);

// Route to verify the reset password token (using GET, since it's a verification step)
userRouter.get("/verify-reset-password-token", verifyResetPasswordToken);

userRouter.post("/reset-password", resetPassword);

userRouter.get("/dashboard", getDashboardData);


export default userRouter;
