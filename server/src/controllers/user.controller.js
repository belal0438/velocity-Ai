import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import jwt from "jsonwebtoken";

const generateTokenAccess = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    // console.log("userId", user);
    // console.log("accesToken", accessToken);
    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  // console.log("email", email);
  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // console.log("req.file", req.files);
  const profilePicLocalPath = req.files?.profilePic[0]?.path;

  if (!profilePicLocalPath) {
    throw new ApiError(400, "profilepic file is required");
  }

  // here we have to check user on basis of username or email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    fs.unlinkSync(profilePicLocalPath); // if user exist then why store image data in local storage
    throw new ApiError(409, "User with email or username already exist");
  }

  console.log("profilePicLocalPath>>>>>>", profilePicLocalPath);

  const profilepic = await uploadOnCloudinary(profilePicLocalPath);

  if (!profilepic) {
    throw new ApiError(400, "profilepic file is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    profilePicture: profilepic.url,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken } = await generateTokenAccess(user._id);
  // console.log("tokenGenerate>>>", accessToken);
  const loggedInUser = await User.findById(user._id).select("-password");
  // console.log("loggedInUser>>>>>>", loggedInUser);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "User logged In successfully"
    )
  );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId)
    .populate("createdPolls")
    .populate("votedPolls");
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  return res.status(201).json(new ApiResponse(200, user, "User registerd"));
});

export { registerUser, loginUser, getUserProfile };
