import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
import { uploadcloud } from "../utils/cloudnary.js";
import fs from "fs";

// ✅ Create Post Controller
const createPost = asyncHandler(async (req, res) => {
  const { text, author, privacy } = req.body;

  if (!author) {
    throw new ApiError(400, "Author ID is required");
  }

  const mediaUrls = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadcloud(file.path);
      if (uploaded?.secure_url) {
        mediaUrls.push(uploaded.secure_url);
      }
    }
  }

  const post = await Post.create({
    author,
    text,
    media: mediaUrls,
    privacy,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});


// GET all posts with user (author) details
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "fullname username avatar");

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});


const likeposts = asyncHandler( async (req,res)=>{
  const postId = req.params.id;
  const userId = req.body.userId;

   try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes.pull(userId); // Remove like
    } else {
      post.likes.push(userId); // Add like
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like Post Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export { createPost  ,getAllPosts,likeposts};
