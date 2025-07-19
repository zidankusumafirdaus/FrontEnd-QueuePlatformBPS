import axios from "axios";


// baseURL without BackEnd API, because already proxy in vite.config.js
const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// API Interceptors
export default API;

// API for Guest
export const getAllGuests = () => API.get("/guest/allguest");
export const createGuest = (data) => API.post("/guest/form", data);
export const getGuestById = (id) => API.get(`/guest/${id}`);
export const deleteGuest = (guest_id, token) => API.delete(`/guest/${guest_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// API for Visit
export const getVisits = () => API.get("/visit/visits");
export const createVisit = (data) => API.post("/visit/visits", data);
export const getVisitByCategory = () => API.get("/visit/category");
export const updateVisit = (id, data, token) => API.put(`/visit/visits/${id}`, data, token ? {
    headers: { Authorization: `Bearer ${token}` } } : undefined
  );

// API for CS
export const loginCS = (data) => API.post("/cs/login", data);
export const resetQueue = (token) => API.post("/cs/reset", {}, { headers: { Authorization: `Bearer ${token}` } });
export const confirmVisit = (visit_id, token) => API.put(`/cs/confirm/${visit_id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getCSLogs = (token) => API.get("/cs/actlogs", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const resetDatabase = (token) =>
  API.post("/cs/resetdb", {}, { headers: { Authorization: `Bearer ${token}` } });

// API for Export
export const exportGuests = () => API.get("/export/guest", { responseType: "blob" });
export const exportVisits = () => API.get("/export/visit", { responseType: "blob" });
export const exportLogs = () => API.get("/export/logs", { responseType: "blob" });
