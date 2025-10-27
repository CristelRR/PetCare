import { Request, Response } from "express";
import User from "../models/User";

/**
 * Eliminar usuario por correo electrónico
 */
export const deleteUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    // Busca y elimina por email
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: `Usuario con email ${email} eliminado correctamente` });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
