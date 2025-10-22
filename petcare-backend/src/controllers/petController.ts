import { Request, Response } from "express";
import Pet from "../models/Pet";

// Extender Request para multer
interface MulterRequest extends Request {
  file?: Express.Multer.File; // ❌ NOTA: file es opcional
}

export const createPet = async (req: MulterRequest, res: Response) => {
  try {
    const { name, birth, owner } = req.body;
    const photo = req.file?.filename; // acceso seguro con ?.

    if (!name || !birth || !photo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newPet = new Pet({ name, birth, photo, owner });
    await newPet.save();

    res.status(201).json({ message: "Mascota registrada correctamente", pet: newPet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar mascota" });
  }
};
