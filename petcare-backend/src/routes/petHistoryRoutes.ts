import express from "express";
import {
  getPetHistory,
  addVaccination,
  addDeworming,
  addTreatment,
  addClinicalHistory,
  addBirth,
  deleteHistoryItem,
} from "../controllers/petHistoryController";

const router = express.Router();

// Obtener historial de una mascota
router.get("/:petId", getPetHistory);

// Agregar registros
router.post("/:petId/vaccination", addVaccination);
router.post("/:petId/deworming", addDeworming);
router.post("/:petId/treatment", addTreatment);
router.post("/:petId/clinical", addClinicalHistory);
router.post("/:petId/birth", addBirth);

// Eliminar registro (opcional)
router.delete("/:petId/:type/:index", deleteHistoryItem);

export default router;
