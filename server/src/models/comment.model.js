import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    poll: {
      type: Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    text: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model("Comment", CommentSchema);
