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
import QueueKunjunganDinas from './pages/guest/QueueKunjunganDinas';
import WeeklyAutoExport from './pages/cs/WeeklyAutoExport';

// Error components
import ErrorHandlers from './utils/ErrorHandlers';
import NotFound from './components/error/404';
import Error403 from './components/error/403';
import Error405 from './components/error/405';
import Error500 from './components/error/500';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorHandlers>
      <Router>
        <Routes>
          {/* Guest */}
          <Route path="/" element={<Navigate to="/BPS-BukuTamu" replace />} />
          <Route path="/BPS-BukuTamu" element={<HomePage />} />
          <Route path="/Form-Biodata" element={<GuestPage />} />
          <Route path="/Nomor-Antrian" element={<QueueNumber />} />
          <Route path="/queue-kunjungan-dinas" element={<QueueKunjunganDinas />} />

          {/* Customer Service */}
          <Route path="/login-BukuTamu" element={<LoginPage />} />
          <Route path="/visit-guest" element={<ProtectedRoute> <VisitPage /> </ProtectedRoute>} />
          <Route path="/cslogs-BukuTamu" element={<ProtectedRoute> <CSLogs /> </ProtectedRoute>} />
          <Route path="/all-guests" element={<ProtectedRoute> <AllGuestPage /> </ProtectedRoute>} />
          <Route path="/weekly-exports" element={<ProtectedRoute> <WeeklyAutoExport /> </ProtectedRoute>} />

          {/* Error Handlers */}
          <Route path="*" element={<NotFound />} />
          <Route path="/403" element={<Error403 />} />
          <Route path="/405" element={<Error405 />} />
          <Route path="/500" element={<Error500 />} />
        </Routes>
      </Router>
    </ErrorHandlers>
  </React.StrictMode>
);