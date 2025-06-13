import { Router } from "express";
import { userLogIn, userSignUp, userLogOut } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/local-signup', userSignUp);
authRouter.post('/local-login', userLogIn);
authRouter.post('/logout', userLogOut);

export default authRouter;