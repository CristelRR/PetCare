import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.104:5000/api";

// Registrar mascota
export const registerPet = async ({ name, birth, ownerId, photo }) => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();
  formData.append("name", name);
  formData.append("birth", birth);
  if (ownerId) formData.append("ownerId", ownerId);
  formData.append("photo", {
    uri: photo,
    type: "image/jpeg",
    name: "pet.jpg",
  });

  return axios.post(`${API_URL}/pets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

