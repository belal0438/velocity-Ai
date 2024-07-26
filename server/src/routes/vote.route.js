import { Router } from "express";
import { vote } from "../controllers/vote.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/votes").post(verifyJWT, vote);

export default router;
