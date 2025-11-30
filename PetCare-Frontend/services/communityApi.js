import axios from "axios";
import { API_URL } from "@env";  // Debe apuntar a tu backend

export const getPosts = () =>
  axios.get(`${API_URL}/community/posts`);

export const createPost = (data, token) =>
  axios.post(`${API_URL}/community/posts`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const likePost = (id, token) =>
  axios.post(`${API_URL}/community/posts/${id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
