import mongoose, { Schema } from "mongoose";

const VoteSchema = new Schema(
  {
    poll: {
      type: Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    option: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Vote = mongoose.model("Vote", VoteSchema);
