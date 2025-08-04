import express from "express";
import multer from "multer";
import { createPost ,getAllPosts } from "../controllers/postController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/create", upload.array("media"), createPost);
router.get("/", getAllPosts);
export default router;