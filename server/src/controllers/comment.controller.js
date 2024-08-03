import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const postComment = asyncHandler(async (req, res) => {
  const pollId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;
  //   console.log("pollId>>", pollId, "userid>>", userId, "contentd>>", content);

  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }
  const comment = await Comment.create({
    poll: pollId,
    text: content,
    user: userId,
  });

  const commentdata = { user: userId, content, createdAt: new Date() };
  poll.comments.push(comment._id);
  await poll.save();

  return res.status(201).json(new ApiResponse(200, poll, "Comment added"));
});

const getComments = asyncHandler(async (req, res) => {
  const pollId = req.params.id;

  const poll = await Poll.findById(pollId).populate({
    path: "comments",
    populate: {
      path: "user",
      select: "username",
    },
  });

  if (!poll) {
    throw new ApiError(404, "PollId not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, { comments: poll.comments }));
});

export { postComment, getComments };
