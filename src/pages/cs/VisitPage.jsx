import React from "react";
import { useNavigate } from "react-router-dom";

// Importing utility function for logout
import { logout } from "../../utils/auth";

// Importing function from API service
import { resetQueue } from "../../service/api/api";

// Importing the VisitTable component
import VisitTable from "../../components/visit/VisitTable";

// Importing the Export component
import ExportGuestButton from "../../components/export/ExportGuestButton";
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

  return (
    <div>
      <h1>Data Kunjungan</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleResetQueue} style={{ marginLeft: "10px" }}>
        Reset Antrian
      </button>
      <button onClick={() => navigate("/cslogs")}>Lihat Log CS</button>

      {/* Button Export */}
      <div style={{ marginTop: "20px" }}>
        <h3>Export Data</h3>
        <ExportGuestButton />
        <ExportVisitButton />
      </div>

      <VisitTable />
    </div>
  );
};

export default VisitPage;
