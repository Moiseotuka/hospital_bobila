import axios from "axios";
import { getToken, removeToken } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          removeToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
        case 403:
          console.error("Accès refusé");
          break;
        case 422:
          console.error("Erreur de validation", error.response.data.errors);
          break;
        case 500:
          console.error("Erreur serveur");
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
