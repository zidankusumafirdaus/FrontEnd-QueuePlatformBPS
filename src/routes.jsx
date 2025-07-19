import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing pages
import GuestPage from "./pages/guest/GuestPage";
import QueueNumber from "./pages/guest/QueueNumber";
import VisitPage from "./pages/cs/GuestVisitPage";
import LoginPage from "./pages/cs/LoginPage";
import CSLogs from "./pages/cs/CSLogs";
import AllGuestPage from "./pages/cs/AllGuestPage";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/guest" replace />} />
      <Route path="/guest" element={<GuestPage />} />
      <Route path="/visit" element={<VisitPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/queue-number" element={<QueueNumber />} />
      <Route path="/cslogs" element={<CSLogs />} />
      <Route path="/all-guests" element={<AllGuestPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);