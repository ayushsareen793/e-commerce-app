import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

// Attach the JWT to every request when the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ls_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getErrorMessage = (err) =>
  err?.response?.data?.message || (err?.request ? "Cannot reach the server. Is the backend running?" : err.message);

export default api;
