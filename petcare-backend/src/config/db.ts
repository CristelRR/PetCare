import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/petcare";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado   ");
  } catch (err) {
    console.error("Error al conectar MongoDB:", err);
    process.exit(1);
  }
};
