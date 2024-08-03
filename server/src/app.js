import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db/index.js";
import socketAuthMiddleware from "./middlewares/socketAuth.middleware.js";
import { vote } from "./controllers/vote.controller.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// import { User } from "./models/user.model.js";
// import { Poll } from "./models/poll.model.js";
// import { Vote } from "./models/vote.model.js";
// import { Comment } from "./models/comment.model.js";

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
import voteRouter from "./routes/vote.route.js";
import commentRouter from "./routes/comment.route.js";
// routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/polls", pollRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1", voteRouter);

app.use(express.static("build"));

io.use(socketAuthMiddleware);
// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Listening for vote event from clients
  socket.on("vote", async ({ pollId, option }) => {
    try {
      // Use the refactored vote function
      const poll = await vote(pollId, option, socket.userId);
      console.log("poll.votes>>>>", poll);
      // Emit the updated vote counts to all clients
      io.emit("voteUpdate", { pollId, voteCounts: poll });
    } catch (error) {
      console.error("Error voting:", error.message);
      socket.emit("voteError", { message: error.message }); // Send error message to client
    }
  });
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR EVENT FOR APP !!", error);
    });
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILD !!!", err);
  });
