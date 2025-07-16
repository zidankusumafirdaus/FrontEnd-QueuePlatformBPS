import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import GuestPage from "./pages/guest/GuestPage";
import QueueNumber from "./pages/guest/QueueNumber";
import VisitPage from "./pages/cs/GuestVisitPage";
import LoginPage from "./pages/cs/LoginPage";
import CSLogs from "./pages/cs/CSLogs";
import AllGuestPage from "./pages/cs/AllGuestPage";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Leanding Page
function AppContent() {
  const location = useLocation();

  // If User in QueuePage, nav == hidden
  const hideNav = location.pathname === "/queue-number";

  return (
    <>
      {!hideNav && (
        <nav>
          <ul>
            <li><Link to="/guest">Guest</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/visit" element={<VisitPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/queue-number" element={<QueueNumber />} />
        <Route path="/cslogs" element={<CSLogs />} />
        <Route path="/all-guests" element={<AllGuestPage />} />
      </Routes>
    </>
  );
}

export default App;
