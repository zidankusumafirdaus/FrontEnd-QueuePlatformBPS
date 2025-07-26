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
      <div className="mb-6 flex flex-wrap gap-3">
        {fixedCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-5 py-2 rounded-lg text-lg font-medium transition-colors duration-200
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Tamu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tujuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor Antrian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
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
