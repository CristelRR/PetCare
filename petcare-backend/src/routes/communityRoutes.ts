import { Router } from "express";
import auth from "../middleware/auth";
import { uploadPost } from "../config/multer";

import {
  getPosts,
  createPost,
  likePost,
} from "../controllers/communityController";

const router = Router();

router.get("/posts", getPosts);
router.post("/posts", auth, uploadPost.single("image"), createPost);
router.post("/posts/:id/like", auth, likePost);

export default router;
