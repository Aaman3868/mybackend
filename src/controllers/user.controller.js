import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadcloud } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { application } from "express";
const generateAccessTokenandRefreshToken = async(userId) =>{
    try {
        const users = await User.findById(userId)
        const accesstoken = users.generateAccessToken()
        const refreshtoken = users.generateRefreshToken()

        users.refreshtoken = refreshtoken
        await users.save({validateBeforeSave:false})

        return { accesstoken, refreshtoken}
    } catch (error) {
        throw new ApiError(401,"something went wrong")
    }
}
// register User
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body
    console.log(email);

    if ([fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All field Required")
    }

    const exstinguser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (exstinguser) {
        throw new ApiError(409, "User and email already Existed");
    }

    const avatarlocalpath = req.files?.avatar?.[0]?.path;
    const coverImagelocalpath = req.files?.coverImage?.[0]?.path;
    console.log(avatarlocalpath);
    console.log(coverImagelocalpath);

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar image required");
    }

    const avatar = await uploadcloud(avatarlocalpath);
    const coverimage = await uploadcloud(coverImagelocalpath);

    if (!avatar) {
        throw new ApiError(400, "Avatar image required");
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase() || "",
        avatar: avatar?.secure_url || "",       // ✅ set avatar from Cloudinary
        coverimage: coverimage?.secure_url || ""  // ✅ optional

    })

    const createuser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if (!createuser) {
        throw new ApiError(500, "something wents wrong");
    }

    return res.status(201).json(
        new ApiResponse(200, createuser, "user registered")
    )
});

// login
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  const isValid = await user.ispasswordCorrect(password);

  if (!isValid) {
    throw new ApiError(401, "Password invalid");
  }

  // ✅ Await token generation
  const { accesstoken, refreshtoken } = await generateAccessTokenandRefreshToken(user._id);

  const loggedUser = await User.findById(user._id).select("-password -refreshtoken");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  return res
    .status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accesstoken, refreshtoken },
        "Login successful"
      )
    );
});

// logout 
const logoutuser = asyncHandler(async (req, res) => {
  // 1. Remove refresh token from DB
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshtoken: undefined } },
    { new: true }
  );

  // 2. Clear cookies by setting empty values with expired time
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0) // Expire immediately
  };

  return res
    .status(200)
    .cookie("accessToken", "", options)
    .cookie("refreshtoken", "", options)
    .json(
      new ApiResponse(200, null, "Logout successfully")
    );
});

const refreshAccessToken = asyncHandler(async (req,res) =>{
   const comingtoken =  req.cookie.refreshtoken || req.body.refreshtoken

   if(!comingtoken){
    throw new error(401,"Unatuhorized No Token Availble")
   }

   try {
    const decoded = jwt.verify(comingtoken,process.env.REFRESH_TOKEN_SECRET)
 
    const users = await User.findById(decoded?._id)
      if(!users){
     throw new ApiError(401,"Invalid Refresh Toeken")
    }
 
    if(comingtoken !== users?.refreshtoken){
     throw new ApiError(401, "Token is expired")
    }
 
    const options ={
     httpOnly:true,
     sccure :true
    }
 
   const {accesstoken, newrefreshtoken }=await  generateAccessTokenandRefreshToken(users.id)
 
   return res
     .status(200)
     .cookie("accessToken", accesstoken, options)
     .cookie("refreshtoken", newrefreshtoken, options)
     .json(
       new ApiResponse(
         200,
         {  accesstoken, refreshtoken: newrefreshtoken },
         "Login successful"
       )
     );
   } catch (error) {
     throw new ApiError(401,"Invalid Token")
   }
})

const changeCurrentPassword = asyncHandler(async (req,res)=>{
    const {oldpassword,newpassword} = req.body

    const user = await User.findById(req.user?._id)
   ispasswordCorrect = await  user.ispasswordCorrect(oldpassword)

   if(!ispasswordCorrect){
    throw new ApiError(400,"Invalid Old Password")
   }

   user.password = newpassword
   await user.save({validateBeforeSave:false})

   return res.status(200)
   .json(new ApiResponse(200, {},"Password Updated"))
})


const getcurrentUser = asyncHandler(async (req,res)=>{
    
    return res
        .status(200)
        .json(200,req.user, "current User fetch")
})


const updateaccout = asyncHandler(async (req,res)=>{
    const {fullname,email} = req.body

    if(!fullname || !email){
        throw new ApiError(401,"fullname or email required");
    }
    
    const updateuser = User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullname,
                email:email
            }
    },{
        new:true
    }).select("-password")


    return res.status(200)
    .json(new ApiResponse(200,updateuser,"User Updated"))

});


const updateavatar = asyncHandler(async(req,res)=>{
    const avtarlocal = req.files?.path

    if(!avtarlocal){
        throw new ApiError(400,"No localpath")
    }

    const avatar = await uploadcloud(avtarlocal)
     if(!avatar.url){
        throw new ApiError(400,"No localpath avaialble")
    }

 const users =  await  User.findByIdAndUpdate(req.user?._id,{
        $set:{
             avatar:avatar.url
        }
    },{new:true}).select("-password")

     return res.status(200)
    .json(new ApiResponse(200,users,"User Image updated"))
})

const updateCoverImage = asyncHandler(async(req,res)=>{
    const coverlocal = req.files?.path

    if(!avtarlocal){
        throw new ApiError(400,"No coverlocal")
    }

    const coverimage = await uploadcloud(avtarlocal)
     if(!coverimage.url){
        throw new ApiError(400,"No coverlocal avaialble")
    }

  const users=  await  User.findByIdAndUpdate(req.user?._id,{
        $set:{
             coverimage:coverimage.url
        }
    },{new:true}).select("-password")

     return res.status(200)
    .json(new ApiResponse(200,users,"User Image updated"))
})

export { registerUser,
    loginUser,
    logoutuser,
    refreshAccessToken ,
     changeCurrentPassword ,
     getcurrentUser,
     updateaccout,
     updateavatar,updateCoverImage
    };
