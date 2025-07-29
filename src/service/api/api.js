import axios from "axios";
import { logout } from "../../utils/auth";

// Buat instance axios
const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan token secara otomatis
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk menangani error (misalnya 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = "/login-BukuTamu";
    }
    return Promise.reject(error);
  }
);

export default API;

// API untuk Guest
export const getAllGuests = () => API.get("/guest/allguest");
export const createGuest = (data) => API.post("/guest/form", data);
export const getGuestById = (id) => API.get(`/guest/${id}`);
export const deleteGuest = (guest_id) => API.delete(`/guest/${guest_id}`);

// API untuk Visit
export const getVisits = () => API.get("/visit/GetVisits");
export const createVisit = (data) => API.post("/visit/visits", data);
export const getVisitByCategory = () => API.get("/visit/category");
export const updateVisit = (id, data) => API.put(`/visit/visits/${id}`, data);

// API untuk CS (Customer Service)
export const loginCS = (data) => API.post("/cs/login", data);
export const resetQueue = () => API.post("/cs/reset");
export const confirmVisit = (visit_id) => API.put(`/cs/confirm/${visit_id}`);
export const getCSLogs = () => API.get("/cs/actlogs");
export const resetDatabase = () => API.post("/cs/resetdb");
export const getNextReset = () => API.get("/cs/reset-countdown");

// API untuk Export
export const exportGuests = () => API.get("/export/guest", { responseType: "blob" });
export const exportVisits = () => API.get("/export/visit", { responseType: "blob" });
export const exportLogs = () => API.get("/export/logs", { responseType: "blob" });
