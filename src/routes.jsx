import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ProtectedRoute from './utils/ProtectRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing pages
import GuestPage from "./pages/guest/GuestPage";
import QueueNumber from "./pages/guest/QueueNumber";
import VisitPage from "./pages/cs/GuestVisitPage";
import LoginPage from "./pages/cs/LoginPage";
import CSLogs from "./pages/cs/CSLogs";
import AllGuestPage from "./pages/cs/AllGuestPage";
import HomePage from "./pages/home/HomePage";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/BPS-BukuTamu" replace />} />
        <Route path="/BPS-BukuTamu" element={<HomePage />} />
        <Route path="/Form-Biodata" element={<GuestPage />} />
        <Route path="/Nomor-Antrian" element={<QueueNumber />} />
        <Route path="/login-BukuTamu" element={<LoginPage />} />
        <Route path="/visit-guest" element={<ProtectedRoute> <VisitPage /> </ProtectedRoute>} />
        <Route path="/cslogs-BukuTamu" element={<ProtectedRoute> <CSLogs /> </ProtectedRoute>} />
        <Route path="/allguests" element={<ProtectedRoute> <AllGuestPage /> </ProtectedRoute>} />
      </Routes>
    </Router>
  </React.StrictMode>
);