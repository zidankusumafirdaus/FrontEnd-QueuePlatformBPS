import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchNextReset, calculateCountdown } from "../../utils/ResetCountVisit";
import VisitTable from "../../components/tables/VisitTable";
import ExportVisitButton from "../../components/export/ExportVisitButton";
import ResetQueueButton from "../../components/buttons/ResetQueueButton";
import ResetDatabaseButton from "../../components/buttons/ResetDatabaseButton";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import ResetCountdown from "../../components/core/CountdownElements";

import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../components/guest/ConfirmModal";

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
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between w-full">
            <h1 className="text-4xl font-bold mb-6 text-[#00AEEF]">Data Kunjungan</h1>
            {loadingReset ? (
              <p className="text-gray-500 self-center">Memuat waktu reset...</p>
            ) : (
              <ResetCountdown nextReset={nextReset} countdown={countdown} />
            )}
          </div>

          <div className="flex space-x-4 justify-between w-full">
            <div className="flex space-x-4">
              <ResetQueueButton onClick={() => setShowResetQueueModal(true)} />
              <ExportVisitButton />
            </div>
            <ResetDatabaseButton onClick={() => setShowResetDatabaseModal(true)} />
          </div>
        </section>

        {/* Visit Table */}
        <section className="">
          <VisitTable />
        </section>

        {/* Modal Reset Database */}
        <ConfirmModal
          show={showResetDatabaseModal}
          onClose={handleCloseResetDatabaseModal}
          onConfirm={() => {
            const resetDatabaseBtn = document.querySelector('[data-reset-database-btn]');
            if (resetDatabaseBtn) {
              resetDatabaseBtn.click();
            }
            handleCloseResetDatabaseModal();
          }}
          message={<>
            Yakin ingin menghapus semua data kunjungan dari{' '}
            <span className="text-red-500 font-bold">Database</span>?{' '}
            Tindakan ini tidak dapat dibatalkan!
          </>}
          modalTitle="Konfirmasi"
        />

        {/* Modal Reset Queue */}
        <ConfirmModal
          show={showResetQueueModal}
          onClose={handleCloseResetQueueModal}
          onConfirm={() => {
            const resetQueueBtn = document.querySelector('[data-reset-queue-btn]');
            if (resetQueueBtn) {
              resetQueueBtn.click();
            }
            handleCloseResetQueueModal();
          }}
          message="Yakin ingin mereset nomor antrian saat ini?"
          modalTitle="Konfirmasi"
        />
      </main>
    </div>
  );
};

export default Kunjungan;
