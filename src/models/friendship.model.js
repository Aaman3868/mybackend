import mongoose, { Schema } from "mongoose";

const friendshipSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "blocked"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Friendship = mongoose.model("Friendship", friendshipSchema);
export default Friendship;
