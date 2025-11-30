// src/services/api.js (o api.ts)
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Opcional: instancia de axios
const api = axios.create({
  baseURL: API_URL, // ej. http://localhost:5000/api
});

// ========== AUTH ==========
export const registerUser = ({ email, password }) =>
  api.post("/register", { email, password });

export const loginUser = ({ email, password }) =>
  api.post("/login", { email, password });

export const verifyOtp = ({ email, otp }) =>
  api.post("/verify-otp", { email, otp });

export const requestPasswordReset = (data) =>
  api.post("/forgot-password", data);

export const verifyResetCode = (data) =>
  api.post("/verify-reset-code", data);

export const resetPassword = (data) =>
  api.post("/reset-password", data);

// ========== PERFIL ==========

// Obtener usuario logueado
export const getMe = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No hay token guardado");

  return api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Actualizar perfil
export const updateProfile = async (data) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No hay token guardado");

  return api.put("/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
