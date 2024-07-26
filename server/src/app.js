import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

const app = express();

import { User } from "./models/user.model.js";
import { Poll } from "./models/poll.model.js";
import { Vote } from "./models/vote.model.js";
import { Comment } from "./models/comment.model.js";

dotenv.config({
  path: "./.env",
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16Kb" }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, header"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

import userRouter from "./routes/user.route.js";
import pollRouter from "./routes/poll.route.js";
// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/polls", pollRouter);

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR EVENT FOR APP !!", error);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILD !!!", err);
  });
