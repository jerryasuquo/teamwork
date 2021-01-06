import express from "express";
import userController from "../controllers/userController";
import { isSigninReqValid, isSignupReqValid } from "../middleware/validator";

const router = express.Router();

const { signin, signup } = userController;
router.post("/signin", isSigninReqValid, signin);
router.post("/signup", isSignupReqValid, signup);

export default router;
