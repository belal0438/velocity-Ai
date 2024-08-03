import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";
import { Vote } from "../models/vote.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const vote = async (pollId, option, userId) => {
  // Create the vote
  // console.log("vote>>>", pollId, option, userId);
  await Vote.create({
    poll: pollId,
    option,
    user: userId,
  });
  // Update the poll with the new vote
  await Poll.findByIdAndUpdate(pollId, {
    $push: { votes: { option, user: userId } },
  });
  // Get the updated vote counts
  const poll = await Poll.findById(pollId);
  // console.log("formattedVote>>", poll.votes);
  const frequency = countVoteFrequencies(poll.votes);
  // console.log("frequency>>", frequency);
  return frequency;
};

const countVoteFrequencies = (votes) => {
  // Create a map to count frequencies
  const optionFrequency = {};
  // Iterate through each vote
  votes.forEach((vote) => {
    if (!optionFrequency[vote.option]) {
      optionFrequency[vote.option] = {
        option: [],
        user: vote.user,
        _id: vote._id,
      };
    }
    optionFrequency[vote.option].option.push(vote.option);
  });
  // Convert the map to an array of objects
  const formattedVotes = Object.values(optionFrequency);
  return formattedVotes;
};

// Express route handler
const voteHandler = asyncHandler(async (req, res) => {
  const { pollId, option } = req.body;
  const userId = req.user._id;

  const existingVote = await Vote.findOne({ poll: pollId, user: userId });
  if (existingVote) {
    return res
      .status(400)
      .json({ message: "User has already voted for this poll." });
  }

  const poll = await vote(pollId, option, userId);

  return res.status(201).json(new ApiResponse(200, poll, "Vote count value"));
});

export { vote, voteHandler };
