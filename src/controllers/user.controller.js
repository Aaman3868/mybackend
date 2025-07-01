import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {user} from "../models/user.model.js";
import {uploadcloud} from "../utils/cloudnary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullname,email ,username,password} = req.body
  console.log(email);

if( [fullname,email,username,password].some((field) =>
    field?.trim() === "")
){
throw new ApiError(400,"All field Required")
}

const exstinguser = User.findOne({
    $or: [{username},{email}]
})

if(exstinguser){
    throw new ApiError(409,"User and email already Existed");
}

const avatarlocalpath = req.files?.avatar[0]?.path
const coverImagelocalpath = req.files?.coverImage[0]?.path
console.log(avatarlocalpath);
console.log(coverImagelocalpath);

if(!avatarlocalpath){
    throw new ApiError(400, "Avatar image required");
}

const avatar = await uploadcloud(avatarlocalpath);
const coverimage = await uploadcloud(coverImagelocalpath);

if(!avatar){
    throw new ApiError(400, "Avatar image required");
}

const User = await user.create({
    fullname,
    avatar: avatar.url,
    coverimage:coverimage.url || "",
    email,
    password,
    username : username.toLowerCase() || "",

})

const createuser = await user.findById(user._id).select(
    "-password -refreshtoken"
)

if(!createuser){
    throw new ApiError(500,"something wents wrong");
}

return  res.status(201).json(
    new ApiResponse(200,createuser,"user registered")
)
});

export { registerUser };
