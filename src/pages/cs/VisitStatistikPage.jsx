import React, { useEffect, useState } from "react";
import { getVisitByCategory, getAllGuests, updateVisit } from "../../service/api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarAdmin from "../../components/elements/SidebarAdmin";

const VisitStatistikPage = () => {
  const [visits, setVisits] = useState([]);
  const [guestMap, setGuestMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitRes, guestRes] = await Promise.all([
          getVisitByCategory(),
          getAllGuests(),
        ]);

        const kategoriKey = Object.keys(visitRes?.data || {}).find(
          (key) => key.toLowerCase() === "pelayanan statistik terpadu"
        );
        const categoryData = kategoriKey ? visitRes.data[kategoriKey] : [];

        const map = {};
        (guestRes?.data || []).forEach((g) => {
          map[g.guest_id] = g.guest_name;
        });
        setGuestMap(map);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const visitsWithGuest = categoryData
          .map((v) => ({
            ...v,
            guest_name: map[v.guest_id] || "Tamu Tidak Diketahui",
            dateOnly: new Date(new Date(v.timestamp).setHours(0, 0, 0, 0)),
          }))
          .filter(
            (v) =>
              v.dateOnly.getTime() === today.getTime() &&
              v.queue_number != null &&
              v.queue_number !== ""
          )
          .sort(
            (a, b) => parseInt(a.queue_number) - parseInt(b.queue_number)
          );

        setVisits(visitsWithGuest);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleMark = async (visit) => {
    const token = localStorage.getItem("token");
    const newMark = "hadir";
    const originalMark = visit.mark;

    setVisits((prev) =>
      prev.map((v) =>
        v.visit_id === visit.visit_id ? { ...v, mark: newMark } : v
      )
    );

    try {
      await updateVisit(visit.visit_id, { mark: newMark }, token);
      toast.success(`Tamu "${visit.guest_name}" telah ditandai hadir.`);
    } catch (error) {
      console.error(error);
      toast.error(`Gagal menandai kehadiran tamu "${visit.guest_name}".`);
      setVisits((prev) =>
        prev.map((v) =>
          v.visit_id === visit.visit_id ? { ...v, mark: originalMark } : v
        )
      );
    }
  };

  const nextVisit = () => {
    if (currentIndex < visits.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevVisit = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentVisit = visits[currentIndex];
  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start overflow-auto p-8">
        <div className="w-full max-w-4xl">
          {loading ? (
            <p className="text-gray-600 text-lg mt-10">
              Memuat data kunjungan...
            </p>
          ) : visits.length === 0 ? (
            <p className="text-gray-600 text-lg mt-10">
              Tidak ada kunjungan hari ini.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-8 shadow-sm">
                <div className="bg-[#00B4D8] rounded-lg p-3">
                  <p className="text-white text-xs mb-1">Nama</p>
                  <p className="text-white font-bold text-sm">
                    {currentVisit.guest_name}
                  </p>
                </div>
                <div className="bg-[#99D98C] rounded-lg p-3">
                  <p className="text-white text-xs mb-1">Tanggal</p>
                  <p className="text-white font-bold text-sm">{date}</p>
                </div>
                <div className="bg-[#F77F00] rounded-lg p-3">
                  <p className="text-white text-xs mb-1">Tujuan Kunjungan</p>
                  <p className="text-white font-bold text-sm break-words">
                    {currentVisit.target_service}
                  </p>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-[#00B4D8] text-2xl font-bold mb-4">
                  NOMOR ANTRIAN
                </h1>
                <div className="inline-block rounded-lg p-6">
                  <span className="text-[#00B4D8] text-6xl font-bold">
                    {currentVisit.queue_number}
                  </span>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-[#00B4D8] text-xl font-bold">
                  PELAYANAN STATISTIK
                </h2>
                <h2 className="text-[#00B4D8] text-xl font-bold">TERPADU</h2>
              </div>

              {currentVisit.purpose && (
                <div className="bg-[#FFF3CD] rounded-lg p-4 mb-6">
                  <h3 className="text-[#856404] font-medium mb-2 text-sm">
                    Catatan Pengunjung :
                  </h3>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-[#856404] text-sm">
                      {currentVisit.purpose}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <p
                  className={`font-semibold text-sm ${
                    currentVisit.mark === "hadir"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status:{" "}
                  {currentVisit.mark.charAt(0).toUpperCase() +
                    currentVisit.mark.slice(1)}
                </p>
              </div>

              <div className="flex justify-between items-center gap-3">
                <button
                  onClick={prevVisit}
                  disabled={currentIndex === 0}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    currentIndex === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Sebelumnya
                </button>

                {currentVisit.mark !== "hadir" && (
                  <button
                    onClick={() => handleToggleMark(currentVisit)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Tandai Hadir
                  </button>
                )}

                <button
                  onClick={nextVisit}
                  disabled={currentIndex === visits.length - 1}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    currentIndex === visits.length - 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Berikutnya
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-500">
                {currentIndex + 1} dari {visits.length} kunjungan hari ini
              </p>
            </>
          )}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </main>
    </div>
  );
};

export default VisitStatistikPage;
