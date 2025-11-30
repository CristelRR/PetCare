import { Router } from "express";
import auth from "../middleware/auth";
import {
  getPosts,
  createPost,
  likePost,
} from "../controllers/communityController";

const router = Router();

router.get("/posts", getPosts);
router.post("/posts", auth, createPost);  // 🔥 SIN MULTER!!
router.post("/posts/:id/like", auth, likePost);

export default router;
