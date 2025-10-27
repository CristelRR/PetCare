import express from "express";
import multer from "multer";
import { identifyPet } from "../controllers/aiController";

const router = express.Router();

// Configurar Multer para subir imagen
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Ruta de IA
router.post("/ai/identify", upload.single("photo"), identifyPet);

export default router;
