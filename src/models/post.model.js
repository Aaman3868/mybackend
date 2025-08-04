import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, maxlength: 1000 },
  media: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  privacy: {
    type: String,
    enum: ["Everyone", "Friends Only", "Private"],
    default: "Everyone",
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ DEFAULT EXPORT
const Post = mongoose.model("Post", postSchema);
export default Post;
