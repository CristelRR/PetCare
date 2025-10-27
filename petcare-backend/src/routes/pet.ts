import express from "express";
import multer from "multer";
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} from "../controllers/petController";
import path from "path";

const router = express.Router();

/*  Configuración de Multer para imágenes  */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // ruta absoluta
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * @openapi
 * /pets:
 *   get:
 *     summary: Obtener todas las mascotas del usuario autenticado
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas del usuario
 *   post:
 *     summary: Crear una nueva mascota con imagen
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Firulais"
 *               species:
 *                 type: string
 *                 example: "Perro"
 *               breed:
 *                 type: string
 *                 example: "Labrador"
 *               age:
 *                 type: integer
 *                 example: 4
 *               photo:
 *                 type: string
 *                 format: binary
 *                 example: (archivo .jpg o .png)
 *     responses:
 *       201:
 *         description: Mascota registrada correctamente
 *       400:
 *         description: Campos faltantes o inválidos
 *       500:
 *         description: Error interno del servidor
 */

// Rutas
router.get("/pets", getPets);
router.post("/pets", upload.single("photo"), createPet); // ← aquí se usa multer para subir una sola imagen

// Otras rutas opcionales
router.get("/pets/:id", getPetById);
router.put("/pets/:id", upload.single("photo"), updatePet);
router.delete("/pets/:id", deletePet);

export default router;
