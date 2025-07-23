import React from "react";

// Importing from service
import { exportVisits } from "../../service/api/api";

const ExportVisitButton = () => {
  const downloadVisitFile = async () => {
    try {
      const res = await exportVisits();

      // Check if the response contains actual data
      if (res.data.size === 0) {
        alert("Tidak ada data kunjungan untuk diekspor.");
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_kunjungan.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Data kunjungan berhasil diunduh!"); // Success feedback
    } catch (err) {
      alert("Gagal mengunduh data kunjungan. Silakan coba lagi.");
      console.error("Export error:", err);
    }
  };

  return (
    <button
      onClick={downloadVisitFile}
      className="
        bg-green-600 hover:bg-green-700 text-white
        font-bold py-3 px-6 rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75
        text-lg
      "
    >
      Export Kunjungan
    </button>
  );
};

export default ExportVisitButton;