import mongoose, { Schema } from "mongoose";

const PollSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    options: [
      {
        type: String,
        required: true,
      },
    ],

    votes: [
      {
        option: String,
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Poll = mongoose.model("Poll", PollSchema);
