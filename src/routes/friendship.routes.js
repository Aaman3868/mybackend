import express from "express";
import { sendRequest,getFriendRequests,acceptFriendRequest } from "../controllers/friendship.controller.js";
import {verifyJwt} from '../middlewares/auth.middleware.js'

const router = express.Router();

// POST /api/friends/request/:id
router.post("/request/:id", verifyJwt, sendRequest);
router.get("/requests", verifyJwt, getFriendRequests);
router.put("/request/:id/accept", verifyJwt, acceptFriendRequest);
export default router;
