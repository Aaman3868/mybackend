import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Friendship } from "../models/friendship.model.js";


// send Request 
export const sendRequest = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // ✅ set by verifyJwt
  const recipientId = req.params.id; // ✅ comes from /request/:id

  // check missing values
  if (!userId) {
    throw new ApiError(401, "Unauthorized: no user found in token");
  }

  if (!recipientId) {
    throw new ApiError(400, "Recipient ID is required in URL");
  }

  // Prevent self-request
  if (userId.toString() === recipientId.toString()) {
    throw new ApiError(400, "You cannot send a request to yourself");
  }



   const existing = await Friendship.findOne({
    requester: userId,
    recipient: recipientId,
    status: "pending"
  });


  if (existing) {
      await Friendship.deleteOne({ _id: existing._id });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Friend request cancelled"));
  }

  // Create new request
  const friendship = await Friendship.create({
    requester: userId,
    recipient: recipientId,
    status: "pending",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, friendship, "Friend request sent"));
});

// Get Request
export const getFriendRequests = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const requests = await Friendship.find({
    recipient: userId,
    status: "pending",
  }).populate("requester", "fullname email username"); // show requester info

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Friend requests fetched"));
});


// Accept Request
export const acceptFriendRequest = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const requestId = req.params.id; // friendship document id

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const request = await Friendship.findOne({
    _id: requestId,
    recipient: userId,
    status: "pending",
  });

  if (!request) {
    throw new ApiError(404, "Friend request not found or already handled");
  }

  request.status = "accepted";
  await request.save();

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Friend request accepted"));
});
