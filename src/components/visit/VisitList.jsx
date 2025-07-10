import React, { useEffect, useState } from "react";
import { getVisitByCategory } from "../../service/api/api";

const VisitList = () => {
  const [categoryData, setCategoryData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [visits, setVisits] = useState([]);

  const fixedCategories = [
    "Semua",
    "Kunjungan Dinas",
    "pelayanan Statistik Terpadu",
    "Lainnya",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getVisitByCategory();
        setCategoryData(res.data);

        // Set default to all data
        const allVisits = Object.values(res.data).flat();
        setVisits(allVisits);
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === "Semua") {
      const all = Object.values(categoryData).flat();
      setVisits(all);
    } else {
      setVisits(categoryData[selectedCategory] || []);
    }
  }, [selectedCategory, categoryData]);

  return (
    <div>
      <h2>Daftar Kunjungan Berdasarkan Kategori</h2>

      {/* Tombol kategori */}
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

      {/* Tabel daftar kunjungan */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest ID</th>
            <th>Keperluan</th>
            <th>Tujuan</th>
            <th>Waktu</th>
            <th>Nomor Antrian</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visits.length === 0 ? (
            <tr>
              <td colSpan="7" align="center">
                Tidak ada data kunjungan.
              </td>
            </tr>
          ) : (
            visits.map((visit) => {
              const dateObj = new Date(visit.timestamp);
              const tanggal = dateObj.toLocaleDateString("id-ID");
              const waktu = dateObj.toLocaleTimeString("id-ID");

              return (
                <tr key={visit.visit_id}>
                  <td>{visit.visit_id}</td>
                  <td>{visit.guest_id}</td>
                  <td>{visit.purpose}</td>
                  <td>{visit.target_service}</td>
                  <td>
                    {tanggal} <br />
                    {waktu}
                  </td>
                  <td>{visit.queue_number ?? "-"}</td>
                  <td>{visit.mark}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisitList;
