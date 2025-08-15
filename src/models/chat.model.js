import mongoose,{Schema} from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  media: String, // optional: image, video, etc.
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false }
});

const chatSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  updatedAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;