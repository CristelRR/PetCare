import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import petRoutes from "./routes/pet";
import meRoutes from "./routes/meRoutes";
import aiRoutes from "./routes/ai";
import communityRoutes from "./routes/communityRoutes";
import petHistoryRoutes from "./routes/petHistoryRoutes";

import swaggerSpec from "./config/swagger";
import swaggerUi from "swagger-ui-express";

import path from "path";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Servir imágenes subidas
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", petRoutes);
app.use("/api", meRoutes);
app.use("/api", aiRoutes);
app.use("/api/history", petHistoryRoutes);
app.use("/api/community", communityRoutes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`)
);
