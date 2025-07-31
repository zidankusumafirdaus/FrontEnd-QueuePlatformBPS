import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchNextReset, calculateCountdown } from "../../utils/ResetCountVisit";
import VisitTable from "../../components/visit/VisitTable";
import ExportVisitButton from "../../components/export/ExportVisitButton";
import ResetQueueButton from "../../components/export/ResetQueueButton";
import ResetDatabaseButton from "../../components/export/ResetDatabaseButton";
import SidebarAdmin from "../../components/elements/SidebarAdmin";
import ResetCountdown from "../../components/elements/CountdownElements";

import "react-toastify/dist/ReactToastify.css";

const VisitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [showResetDatabaseModal, setShowResetDatabaseModal] = useState(false);
  const [showResetQueueModal, setShowResetQueueModal] = useState(false);

  const [nextReset, setNextReset] = useState(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchNextReset()
      .then((resetTime) => setNextReset(resetTime))
      .catch((err) => {
        console.error("Gagal mendapatkan waktu reset:", err);
        if (err.response) {
          const status = err.response.status;
          if (status === 403) navigate("/403");
          else if (status === 405) navigate("/405");
          else if (status === 500) navigate("/500");
        }
      });
  }, [navigate]);

  useEffect(() => {
    if (!nextReset) return;
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(nextReset));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextReset]);

  // Handler untuk modal, hanya mengatur modal terbuka/tutup
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
          <ResetCountdown nextReset={nextReset} countdown={countdown} />
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

export default VisitPage;