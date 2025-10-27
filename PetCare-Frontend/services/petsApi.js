import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Obtener todas las mascotas del usuario autenticado
export const getPets = async () => {
  const token = await AsyncStorage.getItem("token");
  return axios.get(`${API_URL}/pets`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

// Registrar una nueva mascota (con imagen)
export const registerPet = async (data) => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("species", data.species);
  if (data.breed) formData.append("breed", data.breed);
  if (data.age) formData.append("age", data.age.toString());

  if (data.photo) {
    const uriParts = data.photo.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("photo", {
      uri: data.photo,
      name: `photo.${fileType}`,
      type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
    });
  }

  console.log("📦 Enviando formData con imagen:", formData);

  return axios.post(`${API_URL}/pets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => data, // evita que axios altere el FormData
  });
}

export const identifyPetPhoto = async (photoUri) => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();
  formData.append("photo", {
    uri: photoUri,
    type: "image/jpeg",
    name: "photo.jpg",
  });

  const res = await axios.post(`${API_URL}/ai/identify`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
