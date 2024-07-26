import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPoll = asyncHandler(async (req, res) => {
  const { question, options } = req.body;
  const userId = req.user._id;

  if (!(question || options)) {
    throw new ApiError(400, "qeustion or options is required");
  }

  const poll = await Poll.create({
    question,
    options,
    createdBy: userId,
  });

  await User.findByIdAndUpdate(userId, {
    $push: { createdPolls: poll._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(200, poll, "Poll created Successfully"));
});

const getPolls = asyncHandler(async (req, res) => {
  const polls = await Poll.find().populate("createdBy", "username");
  return res
    .status(201)
    .json(new ApiResponse(200, polls, "Get All polls Successfully"));
});

export { createPoll, getPolls };
