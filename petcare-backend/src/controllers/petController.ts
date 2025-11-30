import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Pet from "../models/Pet";

const JWT_SECRET = process.env.JWT_SECRET!;

// Crear una mascota
export const createPet = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { name, breed, birthDate, sex, color, marks } = req.body;

    if (!name)
      return res.status(400).json({ message: "El nombre es obligatorio" });

    let photoUrl = null;

    // ⭐ Cloudinary devuelve secure_url automáticamente
    if (req.file) {
      photoUrl = (req.file as any).path;
    }

    const newPet = new Pet({
      name,
      breed,
      birthDate,
      sex,
      color,
      marks,
      ownerId: decoded.id,
      photo: photoUrl,
    });

    await newPet.save();
    res.status(201).json({ message: "Mascota registrada correctamente", pet: newPet });

  } catch (error) {
    console.error("Error al crear mascota:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updatePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, breed, birthDate, sex, color, marks } = req.body;

    const pet = await Pet.findByIdAndUpdate(
      id,
      { name, breed, birthDate, sex, color, marks },
      { new: true, runValidators: true }
    );

    if (!pet) return res.status(404).json({ message: "Mascota no encontrada" });

    res.json({ message: "Mascota actualizada correctamente", pet });

  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getPets = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const pets = await Pet.find({ ownerId: decoded.id });

    res.json(pets);

  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getPetById = async (req: Request, res: Response) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Mascota no encontrada" });
    res.json(pet);
  } catch {
    res.status(500).json({ message: "Error al obtener mascota" });
  }
};

export const deletePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);

    if (!pet) return res.status(404).json({ message: "Mascota no encontrada" });

    res.json({ message: "Mascota eliminada correctamente" });

  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
