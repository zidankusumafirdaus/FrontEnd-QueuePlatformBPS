import React from "react";

// Importing from service
import { exportLogs } from "../../service/api/api";

const ExportLogButton = () => {
  const downloadLogFile = async () => {
    try {
      const res = await exportLogs();

      // Check if the response contains actual data
      if (res.data.size === 0) {
        alert("Tidak ada data log untuk diekspor.");
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "log_aktivitas_cs.xlsx"); // Mengganti nama file menjadi lebih spesifik
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Data log berhasil diunduh!"); // Feedback sukses
    } catch (err) {
      alert("Gagal mengunduh data log. Silakan coba lagi.");
      console.error("Export log error:", err);
    }
  };

  return (
    <button
      onClick={downloadLogFile}
      className="
        bg-indigo-600 hover:bg-indigo-700 text-white
        font-bold py-3 px-6 rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
        text-lg
      "
    >
      Export Log
    </button>
  );
};

export default ExportLogButton;