import React, { useState, useMemo } from "react";
import { updateVisit } from "../../service/api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { getAllGuests, getVisitByCategory } from "../../service/api/api";
import "react-toastify/dist/ReactToastify.css";

const fixedCategories = [
  "Semua",
  "Kunjungan Dinas",
  "Pelayanan Statistik Terpadu",
  "Lainnya",
];

const columns = [
  { label: "No", className: "uppercase tracking-wider" },
  { label: "Nama Tamu" },
  { label: "Tujuan" },
  { label: "Catatan" },
  { label: "Waktu" },
  { label: "Nomor Antrian" },
  { label: "Status" },
  { label: "Aksi" },
];

const TableHeader = () => (
  <thead className="bg-[#FFE8D6]">
    <tr>
      {columns.map((col) => (
        <th
          key={col.label}
          className={`px-6 py-3 text-left text-sm text-[#F7941D] uppercase tracking-wider font-bold ${col.className || ""}`}
        >
          {col.label}
        </th>
      ))}
    </tr>
  </thead>
);

const VisitTable = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const {
    data: categoryData = {},
    isLoading: loadingVisits,
  } = useQuery({
    queryKey: ["visitsByCategory"],
    queryFn: async () => {
      const res = await getVisitByCategory();
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 menit
  });

  const {
    data: guestData = [],
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
    (Array.isArray(guestData) ? guestData : []).forEach((g) => {
      map[g.guest_id] = g.guest_name;
    });
    return map;
  }, [guestData]);

  const visits = useMemo(() => {
    const data =
      selectedCategory === "Semua"
        ? Object.values(categoryData).flat()
        : categoryData[
            Object.keys(categoryData).find(
              (key) => key.toLowerCase() === selectedCategory.toLowerCase()
            )
          ] || [];

    return data
      .map((v) => ({
        ...v,
        guest_name: guestMap[v.guest_id] || "Tamu Tidak Diketahui",
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [selectedCategory, categoryData, guestMap]);

  const handleToggleMark = async (visit) => {
    const token = localStorage.getItem("token");
    const newMark = "hadir";
    const previousData = queryClient.getQueryData(["visitsByCategory"]);

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
    } catch (error) {
      toast.error(`Gagal menandai kehadiran tamu "${visit.guest_name}".`);
      // Rollback
      queryClient.setQueryData(["visitsByCategory"], previousData);
    }
  };

  return (
    <div>
      {/* Kategori filter */}
      <div className="mb-6 flex flex-wrap gap-x-8">
        {fixedCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              relative px-0 py-2 text-base font-medium transition-colors duration-200
              bg-transparent outline-none border-none shadow-none
              after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[3px]
              after:bg-[#00AEEF] after:rounded-full after:transition-all after:duration-300
              ${selectedCategory === category
                ? "text-[#00AEEF] font-bold after:w-full"
                : "text-gray-700 after:w-0 hover:after:w-full hover:text-[#00AEEF]"}
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loadingVisits || loadingGuests ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Memuat data kunjungan...</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex flex-col gap-y-4">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
            <TableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data kunjungan untuk kategori ini.
                  </td>
                </tr>
              ) : (
                visits.map((v, index) => {
                  const dateObj = new Date(v.timestamp);
                  const tanggal = dateObj.toLocaleDateString("id-ID");
                  const waktu = dateObj.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  });

                  const statusColorClass =
                    v.mark === "hadir"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold";

                  return (
                    <tr key={v.visit_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{v.guest_name}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{v.target_service}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{v.purpose}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {tanggal} <br /> {waktu}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{v.queue_number ?? "-"}</td>
                      <td className={`px-6 py-4 text-sm whitespace-nowrap ${statusColorClass}`}>
                        {v.mark.charAt(0).toUpperCase() + v.mark.slice(1)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {v.mark === "hadir" ? null : (
                          <button
                            onClick={() => handleToggleMark(v)}
                            className="px-4 py-2 rounded-md text-white bg-[#8DC63F] hover:bg-green-600 whitespace-nowrap"
                          >
                            Tandai Hadir
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default VisitTable;
