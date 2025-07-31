import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchNextReset, calculateCountdown } from "../../utils/ResetCountVisit";
import VisitTable from "../../components/visit/VisitTable";
import ExportVisitButton from "../../components/export/ExportVisitButton";
import ResetQueueButton from "../../components/export/ResetQueueButton";
import ResetDatabaseButton from "../../components/export/ResetDatabaseButton";
import SidebarAdmin from "../../components/elements/SidebarAdmin";
import ResetCountdown from "../../components/elements/CountdownElements";

import "react-toastify/dist/ReactToastify.css";

const GuestVisitPage = () => {
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
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Data Kunjungan</h1>
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
        {showResetDatabaseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi</h2>
              <p className="mb-6 text-gray-600">
                Yakin ingin menghapus <strong>semua</strong> data kunjungan?
                Tindakan ini <strong>tidak dapat dibatalkan!</strong>
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCloseResetDatabaseModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Batal
                </button>
                <ResetDatabaseButton
                  onClick={handleCloseResetDatabaseModal}
                  className="px-4 py-2"
                  confirm
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Reset Queue */}
        {showResetQueueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi</h2>
              <p className="mb-6 text-gray-600">
                Yakin ingin mereset nomor antrian saat ini?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCloseResetQueueModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Batal
                </button>
                <ResetQueueButton
                  onClick={handleCloseResetQueueModal}
                  className="px-4 py-2"
                  confirm
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuestVisitPage;
