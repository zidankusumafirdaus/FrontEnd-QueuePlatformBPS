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

        // Set kategori kunjungan
        const categorizedData = visitRes.data;
        setCategoryData(categorizedData);

        // Buat map tamu (guest_id => guest_name)
        const guestMap = {};
        guestRes.data.forEach((g) => {
          guestMap[g.guest_id] = g.guest_name;
        });
        setGuestMap(guestMap);

        // Gabungkan kunjungan dengan nama tamu
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
      alert("Gagal memperbarui status kehadiran.");
      console.error(error);

      // Revert optimistic update
      setVisits((prevVisits) =>
        prevVisits.map((v) =>
          v.visit_id === visit.visit_id ? { ...v, mark: visit.mark } : v
        )
      );
    }
  };

  return (
    <div>
      <h2>Daftar Kunjungan</h2>

      {/* Tombol filter kategori */}
      <div style={{ marginBottom: "20px" }}>
        {fixedCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              backgroundColor:
                selectedCategory === category ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tabel kunjungan */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Tamu</th>
              <th>Keperluan</th>
              <th>Tujuan</th>
              <th>Waktu</th>
              <th>Nomor Antrian</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan="8" align="center">
                  Tidak ada data kunjungan.
                </td>
              </tr>
            ) : (
              visits.map((v) => {
                const dateObj = new Date(v.timestamp);
                const tanggal = dateObj.toLocaleDateString("id-ID");
                const waktu = dateObj.toLocaleTimeString("id-ID");

                return (
                  <tr key={v.visit_id}>
                    <td>{v.visit_id}</td>
                    <td>{v.guest_name}</td>
                    <td>{v.purpose}</td>
                    <td>{v.target_service}</td>
                    <td>
                      {tanggal} <br /> {waktu}
                    </td>
                    <td>{v.queue_number ?? "-"}</td>
                    <td>{v.mark}</td>
                    <td>
                      <button onClick={() => handleToggleMark(v)}>
                        Tandai {v.mark === "hadir" ? "Tidak Hadir" : "Hadir"}
                      </button>
                      <br />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VisitTable;
