console.log("🔥 CARGANDO communityController DESDE src/controllers/communityController.ts 🔥");

import { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";

/* ============================================================
   GET POSTS
============================================================ */
export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error: any) {
    console.error("⚠️ Error getPosts:", error.message);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
};

/* ============================================================
   CREATE POST (DISCO LOCAL)
============================================================ */
export const createPost = async (req: Request, res: Response) => {
  console.log("\n========================");
  console.log("📥 POST /community/posts");
  console.log("========================");

  console.log("➡️ BODY:", req.body);
  console.log("➡️ FILE:", req.file);

  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { description } = req.body;

    if (!description && !req.file) {
      return res.status(400).json({
        message: "Debes enviar una descripción o una imagen",
      });
    }

    // ================= IMAGEN LOCAL =================
    let imageUrl: string | null = null;

    if (req.file) {
      const filename = req.file.filename;

      if (!filename) {
        return res.status(500).json({ message: "Error procesando imagen" });
      }

      // Ruta pública
      imageUrl = `/uploads/community/${filename}`;
      console.log("🌐 URL Final:", imageUrl);
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const post = new Post({
      userId,
      userName: user.name || user.email,
      description,
      imageUrl,
      likes: [],
      comments: [],
    });

    await post.save();

    console.log("✔️ POST GUARDADO:", post);

    res.status(201).json({ message: "Publicación creada", post });
  } catch (error: any) {
    console.error("🔥 ERROR createPost:", error);
    res.status(500).json({
      message: "Error al crear publicación",
      error: error.message,
    });
  }
};

/* ============================================================
   LIKE POST
============================================================ */
export const likePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const postId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (error: any) {
    console.error("🔥 ERROR likePost:", error);
    res.status(500).json({ message: "Error al dar like" });
  }
};
