import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export const getPets = async () => {
  const token = await AsyncStorage.getItem("token");
  return axios.get(`${API_URL}/pets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

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

export const identifyPetPhoto = async (photoUri) => {
  const token = await AsyncStorage.getItem("token");
  const formData = new FormData();
  formData.append("photo", { uri: photoUri, type: "image/jpeg", name: "photo.jpg" });

  try {
    const res = await axios.post(`${API_URL}/ai/identify`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error IA:", err.message);
    throw err;
  }
};
