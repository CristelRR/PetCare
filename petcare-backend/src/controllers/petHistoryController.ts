import { Request, Response } from "express";
import PetHistory from "../models/PetHistory";

// Obtener historial de una mascota
export const getPetHistory = async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const history = await PetHistory.findOne({ petId });

    if (!history) return res.json({ message: "Sin historial aún", data: null });
    res.json(history);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Agregar vacunación
export const addVaccination = async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const { date, vaccine, batch } = req.body;

    let record = await PetHistory.findOne({ petId });
    if (!record) record = new PetHistory({ petId });

    record.vaccinations.push({ date, vaccine, batch });
    await record.save();

    res.json({ message: "Vacunación agregada correctamente", record });
  } catch (error) {
    console.error("Error al agregar vacunación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Agregar desparasitación
export const addDeworming = async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const { date, product, dose, nextDate } = req.body;

    let record = await PetHistory.findOne({ petId });
    if (!record) record = new PetHistory({ petId });

    record.deworming.push({ date, product, dose, nextDate });
    await record.save();

    res.json({ message: "Desparasitación agregada correctamente", record });
  } catch (error) {
    console.error("Error al agregar desparasitación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Agregar tratamiento
export const addTreatment = async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const { date, treatment } = req.body;

    let record = await PetHistory.findOne({ petId });
    if (!record) record = new PetHistory({ petId });

    record.treatments.push({ date, treatment });
    await record.save();

    res.json({ message: "Tratamiento agregado correctamente", record });
  } catch (error) {
    console.error("Error al agregar tratamiento:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Agregar historia clínica
export const addClinicalHistory = async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const { date, description } = req.body;

    let record = await PetHistory.findOne({ petId });
    if (!record) record = new PetHistory({ petId });

    record.clinicalHistory.push({ date, description });
    await record.save();

    res.json({ message: "Historial clínico agregado correctamente", record });
  } catch (error) {
    console.error("Error al agregar historial clínico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Agregar parto (solo para machos)
export const addBirth = async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const { date, puppies } = req.body;

    let record = await PetHistory.findOne({ petId });
    if (!record) record = new PetHistory({ petId });

    record.births.push({ date, puppies });
    await record.save();

    res.json({ message: "Parto agregado correctamente", record });
  } catch (error) {
    console.error("Error al agregar parto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar un tipo de registro (opcional)
export const deleteHistoryItem = async (req: Request, res: Response) => {
  try {
    const { petId, type, index } = req.params;
    const record = await PetHistory.findOne({ petId });
    if (!record) return res.status(404).json({ message: "Historial no encontrado" });

    // type puede ser 'vaccinations', 'deworming', etc.
    const list = record[type as keyof typeof record] as any[];
    if (!list || !list[Number(index)]) return res.status(400).json({ message: "Ítem no encontrado" });

    list.splice(Number(index), 1);
    await record.save();

    res.json({ message: "Registro eliminado correctamente", record });
  } catch (error) {
    console.error("Error al eliminar registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
