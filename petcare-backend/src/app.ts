import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import petRoutes from "./routes/pet";
import meRoutes from "./routes/meRoutes";
import aiRoutes from "./routes/ai";
import swaggerSpec from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import path from "path";
import petHistoryRoutes from "./routes/petHistoryRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Servir imágenes subidas
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", petRoutes);
app.use("/api", meRoutes);
app.use("/api", aiRoutes);
app.use("/api/history", petHistoryRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT} 🚀`));
