import { Request, Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener posts" });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { description, image } = req.body;

    if (!description || !image) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const newPost = new Post({
      description,
      image,     // BASE64
      userId: req.userId,
    });

    await newPost.save();

    res.status(201).json({ ok: true, post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error al crear publicación" });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    // Convertir a ObjectId
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    // Validación de like / dislike
    if (post.likes.some((id) => id.toString() === req.userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
    } else {
      post.likes.push(userObjectId);  // 👈 AHORA SÍ ObjectId válido
    }

    await post.save();
    res.json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al dar like" });
  }
};
