import React, { useEffect, useState } from "react";

// Importing necessary functions from API service
import { getVisits, getGuestById, confirmVisit, updateVisit, deleteGuest } from "../../service/api/api";

const VisitTable = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await getVisits();
        const visitsData = res.data;

        const visitsWithGuest = await Promise.all(
          visitsData.map(async (visit) => {
            try {
              const guestRes = await getGuestById(visit.guest_id);
              return { ...visit, guest_name: guestRes.data.guest_name };
            } catch {
              return { ...visit, guest_name: "Tamu Tidak Diketahui" };
            }
          })
        );

        setVisits(visitsWithGuest);
      } catch (error) {
        console.error("Error fetching visits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const handleToggleMark = async (visit) => {
    try {
      const token = localStorage.getItem("token");
      await confirmVisit(visit.visit_id, token);
  
      const newMark = visit.mark === "hadir" ? "tidak hadir" : "hadir";

      // Update to backend
      await updateVisit(
        visit.visit_id,
        { mark: newMark },
        token
      );
  
      setVisits((prev) =>
        prev.map((v) =>
          v.visit_id === visit.visit_id ? { ...v, mark: newMark } : v
        )
      );
    } catch (error) {
      alert("Gagal mengonfirmasi kehadiran.");
      console.error(error);
    }
  };

  const handleDeleteGuest = async (guest_id) => {
    const confirm = window.confirm("Yakin ingin menghapus tamu ini?");
    if (!confirm) return;
  
    try {
      const token = localStorage.getItem("token");
      await deleteGuest(guest_id, token);
  
      // Refresh the visits list
      setVisits((prev) => prev.filter((v) => v.guest_id !== guest_id));
    } catch (error) {
      console.error("Gagal menghapus tamu:", error);
      alert("Gagal menghapus tamu.");
    }
  };

  return (
    <div>
      <h2>Daftar Kunjungan</h2>
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
            {visits.map((v) => {
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
                  <td>{v.queue_number}</td>
                  <td>{v.mark}</td>
                  <td>
                    <button onClick={() => handleToggleMark(v)}>
                      Tandai {v.mark === "hadir" ? "Tidak Hadir" : "Hadir"}
                    </button>
                    <br />
                    <button onClick={() => handleDeleteGuest(v.guest_id)}>
                      Hapus Tamu
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VisitTable;
