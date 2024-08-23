// /routes/index.js

import { Router } from "express";
import userRouter from "./user.route.js";


const route = Router();

route.use(userRouter);

export default route;