import express from "express";
import { FriendList } from "../controllers/chatController.js";
const router = express.Router();
router.get("/friendlist", FriendList);
export default router;