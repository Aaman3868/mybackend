import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Chat from "../models/chat.model.js"; 

const FriendList = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Assuming authentication middleware sets req.user

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Find all chats for the current user
  const chats = await Chat.find({
    members: userId,
  })
    .populate("members", "fullname username avatar")
    .sort({ updatedAt: -1 });

  // Extract the "other" member for friend list
  const friends = chats.map((chat) => {
    const otherMember = chat.members.find(
      (member) => member._id.toString() !== userId.toString()
    );
    return {
      chatId: chat._id,
      friend: otherMember,
      lastMessage:
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null,
    };
  });

  res
    .status(200)
    .json(new ApiResponse(200, friends, "Friend list fetched successfully"));
});

export { FriendList };
