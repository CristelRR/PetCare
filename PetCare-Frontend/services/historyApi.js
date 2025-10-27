import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Obtener historial médico de una mascota
export const getPetHistory = async (petId) => {
  const token = await AsyncStorage.getItem("token");
  return axios.get(`${API_URL}/history/${petId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Agregar registro al historial (vacuna, desparasitación, tratamiento, etc.)
export const addPetRecord = async (petId, type, data) => {
  const token = await AsyncStorage.getItem("token");
  return axios.post(`${API_URL}/history/${petId}/${type}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Eliminar registro (opcional)
export const deletePetRecord = async (petId, type, index) => {
  const token = await AsyncStorage.getItem("token");
  return axios.delete(`${API_URL}/history/${petId}/${type}/${index}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
