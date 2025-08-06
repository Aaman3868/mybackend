import express from "express";
import multer from "multer";
import { createPost ,getAllPosts,likeposts } from "../controllers/postController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/create", upload.array("media"), createPost);
router.get("/", getAllPosts);
router.patch("/:id/like", likeposts);
export default router;