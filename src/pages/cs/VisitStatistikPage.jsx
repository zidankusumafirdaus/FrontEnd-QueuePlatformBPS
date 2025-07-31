import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVisitByCategory, getAllGuests, updateVisit } from "../../service/api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarAdmin from "../../components/elements/SidebarAdmin";

const VisitStatistikPage = () => {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: visitData = {},
    isLoading: loadingVisits,
  } = useQuery({
    queryKey: ["visitsByCategory"],
    queryFn: async () => {
      const res = await getVisitByCategory();
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: guests = [],
    isLoading: loadingGuests,
  } = useQuery({
    queryKey: ["allGuests"],
    queryFn: async () => {
      const res = await getAllGuests();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const guestMap = useMemo(() => {
    const map = {};
    guests.forEach((g) => {
      map[g.guest_id] = g.guest_name;
    });
    return map;
  }, [guests]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const visits = useMemo(() => {
    const categoryKey = Object.keys(visitData).find(
      (key) => key.toLowerCase() === "pelayanan statistik terpadu"
    );
    const data = categoryKey ? visitData[categoryKey] : [];

    return data
      .map((v) => ({
        ...v,
        guest_name: guestMap[v.guest_id] || "Tamu Tidak Diketahui",
        dateOnly: new Date(new Date(v.timestamp).setHours(0, 0, 0, 0)),
      }))
      .filter(
        (v) =>
          v.dateOnly.getTime() === today.getTime() &&
          v.queue_number !== null &&
          v.queue_number !== ""
      )
      .sort((a, b) => parseInt(a.queue_number) - parseInt(b.queue_number));
  }, [visitData, guestMap, today]);

  const handleToggleMark = async (visit) => {
    const token = localStorage.getItem("token");
    const newMark = "hadir";

    const previousVisits = [...visits];

    // Optimistic update
    queryClient.setQueryData(["visitsByCategory"], (old) => {
      const updated = { ...old };
      for (const cat in updated) {
        updated[cat] = updated[cat].map((v) =>
          v.visit_id === visit.visit_id ? { ...v, mark: newMark } : v
        );
      }
      return updated;
    });

    try {
      await updateVisit(visit.visit_id, { mark: newMark }, token);
      toast.success(`Tamu "${visit.guest_name}" telah ditandai hadir.`);
    } catch (err) {
      toast.error(`Gagal menandai kehadiran tamu "${visit.guest_name}".`);
      queryClient.setQueryData(["visitsByCategory"], (old) => {
        return previousVisits;
      });
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
      <SidebarAdmin />

      <main className="relative flex-1 flex justify-center items-center p-6 sm:p-10 bg-gray-50 h-screen">
        {!loadingVisits && !loadingGuests && visits.length > 0 && currentVisit && (
          <div className="absolute top-6 left-6">
            <div
              className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium shadow-md backdrop-blur-sm transition duration-200
                ${
                  currentVisit.mark === "hadir"
                    ? "bg-green-100/80 text-green-700 ring-1 ring-green-300"
                    : currentVisit.mark === "tidak hadir"
                    ? "bg-red-100/80 text-red-700 ring-1 ring-red-300"
                    : "bg-gray-100/80 text-gray-700 ring-1 ring-gray-300"
                }
              `}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full mr-2 animate-pulse
                  ${
                    currentVisit.mark === "hadir"
                      ? "bg-green-500"
                      : currentVisit.mark === "tidak hadir"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }
                `}
              ></div>
              {currentVisit.mark
                ? currentVisit.mark.charAt(0).toUpperCase() + currentVisit.mark.slice(1)
                : "Belum Ditandai"}
            </div>
          </div>
        )}

        <div className="w-full max-w-3xl">
          {loadingVisits || loadingGuests ? (
            <p className="text-gray-500 text-lg text-center mt-10">
              Memuat data kunjungan...
            </p>
          ) : visits.length === 0 ? (
            <p className="text-gray-500 text-lg text-center mt-10">
              Tidak ada kunjungan hari ini.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#00B4D8] rounded-xl p-4 shadow-md">
                  <p className="text-white text-xs mb-1">Nama</p>
                  <p className="text-white font-semibold text-base truncate">
                    {currentVisit.guest_name}
                  </p>
                </div>
                <div className="bg-[#99D98C] rounded-xl p-4 shadow-md">
                  <p className="text-white text-xs mb-1">Tanggal</p>
                  <p className="text-white font-semibold text-base">{date}</p>
                </div>
                <div className="bg-[#F77F00] rounded-xl p-4 shadow-md">
                  <p className="text-white text-xs mb-1">Tujuan Kunjungan</p>
                  <p className="text-white font-semibold text-base break-words">
                    {currentVisit.target_service}
                  </p>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-[#00B4D8] text-2xl font-bold mb-3">NOMOR ANTRIAN</h1>
                <div className="inline-block rounded-lg p-6">
                  <span className="text-[#00B4D8] text-6xl font-bold">
                    {currentVisit.queue_number}
                  </span>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-[#00B4D8] text-xl sm:text-2xl font-bold tracking-wide">
                  BADAN PUSAT STATISTIK
                </h2>
              </div>

              {currentVisit.purpose && (
                <div className="bg-[#FFF3CD] rounded-lg p-4 mb-6 border border-[#ffeeba] shadow-sm">
                  <h3 className="text-[#856404] font-medium mb-2 text-sm">
                    Catatan Pengunjung :
                  </h3>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-[#856404] text-sm leading-relaxed">
                      {currentVisit.purpose}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentIndex === 0}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition ${
                    currentIndex === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Sebelumnya
                </button>

                {currentVisit.mark !== "hadir" && (
                  <button
                    onClick={() => handleToggleMark(currentVisit)}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-medium"
                  >
                    Tandai Hadir
                  </button>
                )}

                <button
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(prev + 1, visits.length - 1))
                  }
                  disabled={currentIndex === visits.length - 1}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition ${
                    currentIndex === visits.length - 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Berikutnya
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
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
