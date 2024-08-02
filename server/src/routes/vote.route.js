import { Router } from "express";
import { vote, voteHandler } from "../controllers/vote.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/votes").post(verifyJWT, voteHandler);

export default router;
