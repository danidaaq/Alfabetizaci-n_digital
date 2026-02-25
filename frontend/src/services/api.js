// src/services/api.js
import axios from "axios";

// ✅ Aquí va la URL del backend Laravel (ajústala si tu backend corre en otro puerto)
const API_URL = "http://127.0.0.1:8080/api"; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir el token de autenticación en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
