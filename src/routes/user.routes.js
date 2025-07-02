import { Router } from "express";
import { logoutuser, registerUser ,loginUser,refreshAccessToken} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJwt} from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverimage', maxCount: 1 }
  ]),
  registerUser
);

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyJwt,logoutuser)

export default router;
