import express from "express";
import { uploadPet } from "../config/multer";
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} from "../controllers/petController";

const router = express.Router();

router.get("/pets", getPets);
router.post("/pets", uploadPet.single("photo"), createPet);
router.put("/pets/:id", uploadPet.single("photo"), updatePet);
router.get("/pets/:id", getPetById);
router.delete("/pets/:id", deletePet);

export default router;
