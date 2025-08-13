import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";

import { fetchNextReset, calculateCountdown } from "../../utils/ResetCountVisit";
import VisitTable from "../../components/tables/VisitTable";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import VisitHeaderSection from "../../components/layout/VisitHeaderSection";
import ResetDatabaseModal from "../../components/modals/ResetDatabaseModal";
import ResetQueueModal from "../../components/modals/ResetQueueModal";

const Kunjungan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [showResetDatabaseModal, setShowResetDatabaseModal] = useState(false);
  const [showResetQueueModal, setShowResetQueueModal] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const {
    data: nextReset,
    isLoading: loadingReset,
    isError,
    error
  } = useQuery({
    queryKey: ['nextResetTime'],
    queryFn: fetchNextReset,
    staleTime: 1000 * 60 * 5,
    retry: false,
    onError: (err) => {
      console.error("Gagal mendapatkan waktu reset:", err);
      if (err.response?.status === 403) navigate("/403");
      else if (err.response?.status === 405) navigate("/405");
      else if (err.response?.status === 500) navigate("/500");
    }
  });

  // Countdown updater
  useEffect(() => {
    if (!nextReset) return;
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(nextReset));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextReset]);

  const handleCloseResetDatabaseModal = () => setShowResetDatabaseModal(false);
  const handleCloseResetQueueModal = () => setShowResetQueueModal(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <VisitHeaderSection
          loadingReset={loadingReset}
          nextReset={nextReset}
          countdown={countdown}
          setShowResetQueueModal={setShowResetQueueModal}
          setShowResetDatabaseModal={setShowResetDatabaseModal}
        />

        <ResetDatabaseModal
          show={showResetDatabaseModal}
          onClose={handleCloseResetDatabaseModal}
        />

        <ResetQueueModal
          show={showResetQueueModal}
          onClose={handleCloseResetQueueModal}
        />

        <section>
          <VisitTable />
        </section>
      </main>
    </div>
  );
};

export default Kunjungan;