import React from "react";
import { useNavigate } from "react-router-dom";

// Importing from utility, Services, & Components
import { logout } from "../../utils/auth";
import { resetQueue, resetDatabase } from "../../service/api/api";
import VisitTable from "../../components/visit/VisitTable";
import ExportVisitButton from "../../components/export/ExportVisitButton";

const VisitPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleResetQueue = async () => {
    const confirmReset = window.confirm("Yakin ingin mereset nomor antrian?");
    if (!confirmReset) return;

    try {
      const token = localStorage.getItem("token");
      await resetQueue(token);
      alert("Nomor antrian berhasil direset.");
      window.location.reload();
    } catch (error) {
      console.error("Gagal mereset antrian:", error);
      alert("Gagal mereset antrian.");
    }
  };

  const handleResetDatabase = async () => {
    const confirmReset = window.confirm(
      "Yakin ingin menghapus SEMUA data tamu dan kunjungan? Tindakan ini tidak dapat dibatalkan!"
    );
    if (!confirmReset) return;

    try {
      const token = localStorage.getItem("token");
      await resetDatabase(token);
      alert("Semua data tamu dan kunjungan berhasil dihapus.");
      window.location.reload();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div>
      <h1>Data Kunjungan</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleResetQueue} style={{ marginLeft: "10px" }}>
        Reset Antrian
      </button>
      <button
        onClick={handleResetDatabase}
        style={{
          marginLeft: "10px",
          backgroundColor: "red",
          color: "white",
        }}
      >
        Hapus Semua Data Visit
      </button>
      <button onClick={() => navigate("/cslogs")}>Lihat Log CS</button>
      <button onClick={() => navigate("/all-guests")} style={{ marginLeft: "10px" }}> Lihat Semua Tamu </button>

      {/* Button Export */}
      <div style={{ marginTop: "20px" }}>
        <h3>Export Data</h3>
        <ExportVisitButton />
      </div>

      <VisitTable />
    </div>
  );
};

export default VisitPage;
