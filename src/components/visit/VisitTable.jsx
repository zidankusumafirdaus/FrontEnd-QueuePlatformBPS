import React, { useEffect, useState } from "react";
import {
  getVisitByCategory,
  getAllGuests,
  updateVisit,
} from "../../service/api/api";

const fixedCategories = [
  "Semua",
  "Kunjungan Dinas",
  "pelayanan Statistik Terpadu",
  "Lainnya",
];

const VisitTable = () => {
  const [categoryData, setCategoryData] = useState({});
  const [guestMap, setGuestMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const visitsWithGuest = allVisits.map((v) => ({
          ...v,
          guest_name: guestMap[v.guest_id] || "Tamu Tidak Diketahui",
        }));

        setVisits(visitsWithGuest);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!categoryData || Object.keys(categoryData).length === 0) return;

    const filteredVisits =
      selectedCategory === "Semua"
        ? Object.values(categoryData).flat()
        : categoryData[selectedCategory] || [];

    const visitsWithGuest = filteredVisits.map((v) => ({
      ...v,
      guest_name: guestMap[v.guest_id] || "Tamu Tidak Diketahui",
    }));

    setVisits(visitsWithGuest);
  }, [selectedCategory, categoryData, guestMap]);

  const handleToggleMark = async (visit) => {
    const token = localStorage.getItem("token");
    const newMark = visit.mark === "hadir" ? "tidak hadir" : "hadir";

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
    } catch (error) {
      console.error(error);

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Daftar Kunjungan</h2>

      {/* Tombol filter kategori */}
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
                  Keperluan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tujuan
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
                        {v.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {v.target_service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tanggal} <br /> {waktu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {v.queue_number ?? "-"}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${statusColorClass}`}>
                        {v.mark.charAt(0).toUpperCase() + v.mark.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleMark(v)}
                          className={`
                            px-4 py-2 rounded-md text-white text-sm transition-colors duration-200
                            ${
                              v.mark === "hadir"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }
                          `}
                        >
                          Tandai {v.mark === "hadir" ? "Tidak Hadir" : "Hadir"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitTable;
