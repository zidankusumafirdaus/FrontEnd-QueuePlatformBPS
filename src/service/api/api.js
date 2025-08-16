import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;;

const API = axios.create({
  baseURL: baseURL,
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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401 && !requestUrl.includes("/cs/login")) {
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
export const getCSLogs = () => API.get("/cs/actlogs").then(res => res.data);
export const resetDatabase = () => API.post("/cs/resetdb");
export const getNextReset = () => API.get("/cs/reset-countdown");
export const setDefaultLogExpiry = (days) => API.post("/cs/expiredLogs", { days }).then((res) => res.data)
export const getDefaultLogExpiry = () => API.get("/cs/get-expired-logs").then((res) => res.data.days)

// API untuk Export
export const exportGuests = () => {
  const token = localStorage.getItem("token");
  return API.get("/export/guest", {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const exportVisits = () => {
  const token = localStorage.getItem("token");
  return API.get("/export/visit", {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const exportLogs = () => {
  const token = localStorage.getItem("token");
  return API.get("/export/logs", {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Export API for Weekly Auto Exports
export const getWeeklyExports = () => {
  const token = localStorage.getItem("token");
  return API.get("/export/weekly-auto-exports", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const downloadWeeklyExport = (filename) => {
  const token = localStorage.getItem("token");
  return API.get(`/export/weekly-download-exports/${filename}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteWeeklyExport = (filename) => {
  const token = localStorage.getItem("token");
  return API.delete(`/export/weekly-delete-exports/${filename}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
