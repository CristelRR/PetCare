import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";

const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/google/mobilenet_v2_1.0_224";

export const identifyPet = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.error("⚠️ No se recibió archivo");
      return res.status(400).json({ message: "No se recibió ninguna imagen" });
    }

    console.log("📸 Imagen recibida:", req.file.filename);

    // Leer la imagen del sistema de archivos
    const imageBytes = fs.readFileSync(req.file.path);

    // Enviar la imagen a Hugging Face
    const response = await axios.post(HUGGINGFACE_API_URL, imageBytes, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.error("⚠️ Respuesta inesperada de Hugging Face:", response.data);
      return res.status(200).json({ message: "No se pudo identificar la imagen" });
    }

    const predictions = response.data;
    const best = predictions[0];

    console.log("✅ Predicción IA:", best);

    res.json({
      predictedLabel: best.label,
      confidence: best.score,
    });
  } catch (error: any) {
    console.error("❌ Error en identificación de mascota:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    res.status(500).json({
      message: "Error al procesar la imagen",
      error: error.response?.data || error.message,
    });
  }
};
