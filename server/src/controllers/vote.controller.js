import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";
import { Vote } from "../models/vote.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const vote = asyncHandler(async (req, res) => {
  const { pollId, option } = req.body;
  const userId = req.user._id;
  // Check if the user has already voted for this poll
  const existingVote = await Vote.findOne({ poll: pollId, user: userId });
  if (existingVote) {
    throw new ApiError(400, "User has already voted for this poll.");
  }
  // Create a new vote
  const vote = await Vote.create({
    poll: pollId,
    option,
    user: userId,
  });

  await Poll.findByIdAndUpdate(pollId, {
    $push: { votes: { option, user: userId } },
  });
  // Get the updated vote counts
  const poll = await Poll.findById(pollId);
  const voteCounts = poll.options.map((opt) => ({
    option: opt,
    count: poll.votes.filter((vote) => vote.option === opt).length,
  }));
  return res
    .status(201)
    .json(new ApiResponse(200, voteCounts, "Vote count value"));
});

export { vote };
