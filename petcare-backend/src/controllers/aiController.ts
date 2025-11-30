import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";

const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/google/mobilenet_v2_1.0_224";

export const identifyPet = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ninguna imagen" });
    }

    console.log("📸 Imagen recibida:", req.file.filename);

    const imageBytes = fs.readFileSync(req.file.path);

    const response = await axios.post(HUGGINGFACE_API_URL, imageBytes, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      return res
        .status(200)
        .json({ message: "No se pudo identificar la imagen" });
    }

    //   Ordenamos las predicciones por puntaje (score)
    const predictions = response.data.sort((a, b) => b.score - a.score);
    const best = predictions[0];

    console.log("  Mejor predicción:", best);

    //   Limpiamos el label (“n02094433 Yorkshire_terrier” → “Yorkshire Terrier”)
    const cleanLabel = best.label
      .replace(/^n[0-9]+ /, "")
      .replace(/_/g, " ")
      .trim();

    res.setHeader("Content-Type", "application/json");
    res.json({
      predictedLabel: cleanLabel,
      confidence: best.score,
    });
  } catch (error: any) {
    console.error("❌ Error al identificar mascota:", error.message);
    res.status(500).json({
      message: "Error al procesar la imagen",
      error: error.response?.data || error.message,
    });
  }
};
