// /routes/user.route.js

import { Router } from "express";
import { createNewUser, loginUser } from "../controllers/user.controller.js";
import { createUserValidation, loginValidation } from "../validators/userValidators.js";


const userRouter = Router();

userRouter.post("/register", createUserValidation, createNewUser)
userRouter.post("/login", loginValidation, loginUser)

export default userRouter;
