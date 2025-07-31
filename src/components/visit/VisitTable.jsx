import React, { useEffect, useState } from "react";
import { getVisitByCategory, getAllGuests, updateVisit } from "../../service/api/api";
import { ToastContainer, toast } from "react-toastify";
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
      {columns.map((col, idx) => (
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
  const [categoryData, setCategoryData] = useState({});
  const [guestMap, setGuestMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data kunjungan & tamu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitRes, guestRes] = await Promise.all([
          getVisitByCategory(),
          getAllGuests(),
        ]);

        const categorizedData = visitRes.data;
        setCategoryData(categorizedData);

        const guestMap = {};
        guestRes.data.forEach((g) => {
          guestMap[g.guest_id] = g.guest_name;
        });
        setGuestMap(guestMap);

        const allVisits = Object.values(categorizedData).flat();
        const visitsWithGuest = allVisits
          .map((v) => ({
            ...v,
            guest_name: guestMap[v.guest_id] || "Tamu Tidak Diketahui",
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setVisits(visitsWithGuest);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter berdasarkan kategori
  useEffect(() => {
    if (!categoryData || Object.keys(categoryData).length === 0) return;

    const normalizedKey = Object.keys(categoryData).find(
      (key) => key.toLowerCase() === selectedCategory.toLowerCase()
    );

    const filteredVisits =
      selectedCategory === "Semua"
        ? Object.values(categoryData).flat()
        : categoryData[normalizedKey] || [];

    const visitsWithGuest = filteredVisits
      .map((v) => ({
        ...v,
        guest_name: guestMap[v.guest_id] || "Tamu Tidak Diketahui",
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setVisits(visitsWithGuest);
  }, [selectedCategory, categoryData, guestMap]);

  const handleToggleMark = async (visit) => {
    const token = localStorage.getItem("token");
    const newMark = "hadir";

    setVisits((prevVisits) =>
      prevVisits.map((v) =>
        v.visit_id === visit.visit_id ? { ...v, mark: newMark } : v
      )
    );

    setCategoryData((prevData) => {
      const updatedData = { ...prevData };
      for (const cat in updatedData) {
        updatedData[cat] = updatedData[cat].map((v) =>
          v.visit_id === visit.visit_id ? { ...v, mark: newMark } : v
        );
      }
      return updatedData;
    });

    try {
      await updateVisit(visit.visit_id, { mark: newMark }, token);
      toast.success(`Tamu "${visit.guest_name}" telah ditandai hadir.`);
    } catch (error) {
      console.error(error);
      toast.error(`Gagal menandai kehadiran tamu "${visit.guest_name}".`);

      // rollback
      setVisits((prevVisits) =>
        prevVisits.map((v) =>
          v.visit_id === visit.visit_id ? { ...v, mark: visit.mark } : v
        )
      );
      setCategoryData((prevData) => {
        const revertedData = { ...prevData };
        for (const cat in revertedData) {
          revertedData[cat] = revertedData[cat].map((v) =>
            v.visit_id === visit.visit_id ? { ...v, mark: visit.mark } : v
          );
        }
        return revertedData;
      });
    }
  };

  return (
    <div>
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
            style={{
              overflow: "hidden",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
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
                  <td
                    colSpan="8"
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500 text-base"
                  >
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
                    <tr
                      key={v.visit_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {v.guest_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {v.target_service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {v.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tanggal} <br /> {waktu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {v.queue_number ?? "-"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${statusColorClass}`}
                      >
                        {v.mark.charAt(0).toUpperCase() + v.mark.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {v.mark === "hadir" ? null : (
                          <button
                            onClick={() => handleToggleMark(v)}
                            className={`
                              px-4 py-2 rounded-md text-white text-sm transition-colors duration-200
                              bg-green-500 hover:bg-green-600
                            `}
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

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default VisitTable;
