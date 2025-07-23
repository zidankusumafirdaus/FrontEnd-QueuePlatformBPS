import React from "react";

// Importing from service
import { exportGuests } from "../../service/api/api";

const ExportGuestButton = () => {
  const downloadGuestFile = async () => {
    try {
      const res = await exportGuests();

      // Check if the response contains actual data
      if (res.data.size === 0) {
        alert("Tidak ada data tamu untuk diekspor.");
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_tamu.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Data tamu berhasil diunduh!"); // Success feedback
    } catch (err) {
      alert("Gagal mengunduh data tamu. Silakan coba lagi.");
      console.error("Export error:", err);
    }
  };

  return (
    <button
      onClick={downloadGuestFile}
      className="
        bg-purple-600 hover:bg-purple-700 text-white
        font-bold py-3 px-6 rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75
        text-lg
      "
    >
      Export Tamu
    </button>
  );
};

export default ExportGuestButton;