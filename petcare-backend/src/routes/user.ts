import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

// Obtener info del usuario
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No autorizado" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
});

// Actualizar info del usuario
router.put("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No autorizado" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, avatar, firstLogin: false }, // marca que ya completó perfil
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpires");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
});

// Obtener todos los usuarios
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});



export default router;
