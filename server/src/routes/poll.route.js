import { Router } from "express";
import { createPoll, getPolls } from "../controllers/poll.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createPoll);
router.route("/create").get(verifyJWT, getPolls);
export default router;
