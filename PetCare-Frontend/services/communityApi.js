import axios from "axios";
import { API_URL } from "@env";

// API_URL DEBE SER: http://192.168.0.19:5000/api

export const getPosts = () => 
  axios.get(`${API_URL}/community/posts`);

export const createPost = (formData, token) =>
  axios.post(`${API_URL}/community/posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

export const likePost = (id, token) =>
  axios.post(`${API_URL}/community/posts/${id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
