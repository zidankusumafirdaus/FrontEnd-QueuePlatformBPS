import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaUsers, FaSignOutAlt, FaRedo, FaTrash, FaClipboardList, FaDownload } from "react-icons/fa";
import { fetchNextReset, calculateCountdown } from "../../utils/ResetCountVisit";
import { LogoutPage } from "../../utils/LogoutPage";
import { ResetQueue } from "../../utils/ResetQueue";
import { ResetDatabase } from "../../utils/ResetDatabase";
import VisitTable from "../../components/visit/VisitTable";
import ExportVisitButton from "../../components/export/ExportVisitButton";
import SidebarAdmin from "../../components/export/SidebarAdmin";

import { ToastContainer } from "react-toastify";
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

  const handleConfirmResetDatabase = async () => {
    setShowResetDatabaseModal(false);
    try {
      await ResetDatabase();
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 403) navigate("/403");
        else if (status === 405) navigate("/405");
        else if (status === 500) navigate("/500");
      }
    }
  };

  const handleConfirmResetQueue = async () => {
    setShowResetQueueModal(false);
    try {
      await ResetQueue();
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 403) navigate("/403");
        else if (status === 405) navigate("/405");
        else if (status === 500) navigate("/500");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {/* Countdown */}
        <div className="mb-4">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded shadow">
            <span className="font-semibold">Reset Database Otomatis:</span>{" "}
            {nextReset ? (
              <>
                {countdown.hours} jam {countdown.minutes} menit {countdown.seconds} detik
                {countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 && (
                  <span className="ml-2 text-red-600 font-bold">(Reset!)</span>
                )}
              </>
            ) : (
              <span>Memuat countdown...</span>
            )}
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-gray-800">Data Kunjungan</h1>

        {/* Action Buttons */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowResetQueueModal(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <FaRedo className="text-lg inline-block mr-2" />
              Reset Antrian
            </button>

            <button
              onClick={() => setShowResetDatabaseModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              <FaTrash className="text-lg inline-block mr-2" />
              Hapus Semua Antrian
            </button>

            <ExportVisitButton />
          </div>
        </section>

        {/* Visit Table */}
        <section className="bg-white p-6 rounded-lg shadow-md">
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
                  onClick={() => setShowResetDatabaseModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmResetDatabase}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Hapus
                </button>
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
                  onClick={() => setShowResetQueueModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmResetQueue}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VisitPage;