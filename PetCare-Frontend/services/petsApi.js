import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

//   Obtener todas las mascotas del usuario autenticado
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

//   Registrar una nueva mascota (con imagen)
export const registerPet = async (data) => {
  const token = await AsyncStorage.getItem("token");
  const formData = new FormData();

  formData.append("name", data.name);
  if (data.breed) formData.append("breed", data.breed);
  if (data.birthDate) formData.append("birthDate", data.birthDate);
  if (data.sex) formData.append("sex", data.sex);
  if (data.color) formData.append("color", data.color);
  if (data.marks) formData.append("marks", data.marks);

  if (data.photo) {
    const uriParts = data.photo.split(".");
    const fileType = uriParts[uriParts.length - 1];
    formData.append("photo", {
      uri: data.photo,
      name: `photo.${fileType}`,
      type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
    });
  }

  return axios.post(`${API_URL}/pets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => data,
  });
};

//   IA para identificar raza
export const identifyPetPhoto = async (photoUri) => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();
  formData.append("photo", {
    uri: photoUri,
    type: "image/jpeg",
    name: "photo.jpg",
  });

  try {
    const res = await axios.post(`${API_URL}/ai/identify`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json, text/plain, */*",
      },
      //   fuerza que Axios trate de convertir siempre el JSON
      transformResponse: [
        (data) => {
          try {
            return JSON.parse(data);
          } catch {
            return data;
          }
        },
      ],
    });

    console.log("📡 Respuesta cruda de IA:", res.data);

    // 🔒 Asegurar que siempre devolvemos un objeto JSON válido
    if (typeof res.data === "string") {
      try {
        return JSON.parse(res.data);
      } catch {
        return { predictedLabel: undefined, confidence: undefined };
      }
    }

    return res.data;
  } catch (err) {
    console.error("   Error al llamar a la IA:", err);
    throw err;
  }
};