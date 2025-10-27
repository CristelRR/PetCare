import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export const registerUser = ({ email, password }) =>
  axios.post(`${API_URL}/register`, { email, password });

export const loginUser = ({ email, password }) =>
  axios.post(`${API_URL}/login`, { email, password });

export const verifyOtp = ({ email, otp }) =>
  axios.post(`${API_URL}/verify-otp`, { email, otp });

export const getMe = async () => {
  const token = await AsyncStorage.getItem("token");
  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProfile = async (data) => {
  const token = await AsyncStorage.getItem("token");
  return axios.put(`${API_URL}/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

