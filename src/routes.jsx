import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ProtectedRoute from './utils/ProtectRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing pages
import GuestPage from "./pages/guest/GuestPage";
import QueueNumber from "./pages/guest/QueueNumber";
import Kunjungan from "./pages/cs/Kunjungan";
import LoginPage from "./pages/cs/LoginPage";
import CSLogs from "./pages/cs/CSLogs";
import Tamu from "./pages/cs/Tamu";
import HomePage from "./pages/home/HomePage";
import QueueKunjunganDinas from './pages/guest/QueueKunjunganDinas';
import Export from './pages/cs/Export';
import Antrian from './pages/cs/Antrian';
import QueueKonfirm from './pages/guest/QueueKonfirm';

// Error pages
import ErrorHandlers from './utils/ErrorHandlers';
import NotFound from './pages/error/404';
import Error403 from './pages/error/403';
import Error405 from './pages/error/405';
import Error500 from './pages/error/500';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorHandlers>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Guest */}
            <Route path="/" element={<Navigate to="/BPS-BukuTamu" replace />} />
            <Route path="/BPS-BukuTamu" element={<HomePage />} />
            <Route path="/Form-Biodata" element={<GuestPage />} />
            <Route path="/Nomor-Antrian" element={<QueueNumber />} />
            <Route path="/queue-kunjungan-dinas" element={<QueueKunjunganDinas />} />
            <Route path="/queue-konfirm" element={<QueueKonfirm />} />

            {/* Customer Service */}
            <Route path="/login-BukuTamu" element={<LoginPage />} />
            <Route path="/visit-guest" element={<ProtectedRoute> <Kunjungan /> </ProtectedRoute>} />
            <Route path="/cslogs-BukuTamu" element={<ProtectedRoute> <CSLogs /> </ProtectedRoute>} />
            <Route path="/all-guests" element={<ProtectedRoute> <Tamu /> </ProtectedRoute>} />
            <Route path="/weekly-exports" element={<ProtectedRoute> <Export /> </ProtectedRoute>} />
            <Route path="/antrian-tamu" element={<ProtectedRoute> <Antrian /> </ProtectedRoute>} />

            {/* Error Handlers */}
            <Route path="*" element={<NotFound />} />
            <Route path="/403" element={<Error403 />} />
            <Route path="/405" element={<Error405 />} />
            <Route path="/500" element={<Error500 />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorHandlers>
  </React.StrictMode>
);