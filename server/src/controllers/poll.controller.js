import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";
import { Vote } from "../models/vote.model.js";
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
  const polls = await Poll.find().populate("votes");

  const pollData = polls.map((poll) => {
    const voteCounts = poll.votes.reduce((acc, vote) => {
      acc[vote.option] = (acc[vote.option] || 0) + 1;
      return acc;
    }, {});

    return {
      ...poll.toObject(),
      voteCounts: Object.keys(voteCounts).length ? voteCounts : null,
    };
  });

  return res
    .status(201)
    .json(new ApiResponse(200, pollData, "Vote count value"));

  // const polls = await Poll.find().populate("createdBy", "username");

  // const votedpoll = await Vote.aggregate([
  //   {
  //     $group: {
  //       _id: "$poll",
  //       arrayOfOption: {
  //         $push: "$option",
  //       },
  //     },
  //   },
  // ]);

  // // console.log("option>>", votedpoll);
  // votedpoll.map((ele) => {
  //   // console.log("ele", ele.arrayOfOption);
  //   let object = {};
  //   ele.arrayOfOption.map((item) => {
  //     if (object[item] === undefined) {
  //       object[item] = 1;
  //     } else {
  //       object[item] = object[item] + 1;
  //     }
  //   });
  //   ele.arrayOfOption = object;
  // });

  // return res
  //   .status(201)
  //   .json(new ApiResponse(200, votedpoll, "Vote count value"));

  // return res
  //   .status(201)
  //   .json(new ApiResponse(200, polls, "Get All polls Successfully"));
});

export { createPoll, getPolls };
