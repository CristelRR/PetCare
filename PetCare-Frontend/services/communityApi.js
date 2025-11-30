// src/services/communityApi.js
import axios from "axios";
import { API_URL } from "@env";

export const getPosts = () =>
  axios.get(`${API_URL}/community/posts`);

export const createPost = (data, token) =>
  axios.post(`${API_URL}/community/posts`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const likePost = async (id, token) => {
  return await axios.post(`${API_URL}/community/posts/${id}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
