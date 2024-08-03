import { Router } from "express";
import { postComment, getComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/:id").post(verifyJWT, postComment);
router.route("/:id").get(verifyJWT, getComments);
export default router;
