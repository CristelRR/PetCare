import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// Obtener perfil
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

// Actualizar perfil
router.put("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, firstLogin: false },
      { new: true }
    ).select("-password -otp -otpExpires");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

export default router;
