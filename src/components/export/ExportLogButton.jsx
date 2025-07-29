import React from "react";
import { Download } from "lucide-react";

// Importing from service
import { exportLogs } from "../../service/api/api";

const ExportLogButton = () => {
  const downloadLogFile = async () => {
    try {
      const res = await exportLogs();

      // Check if the response contains actual data
      if (res.data.size === 0) {
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "log_aktivitas_cs.xlsx"); // Mengganti nama file menjadi lebih spesifik
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export log error:", err);
    }
  };

  return (
    <button
      onClick={downloadLogFile}
      className="
        bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75
        text-lg flex items-center gap-2
      "
    >
      <Download className="w-5 h-5" />
      Export Log
    </button>
  );
};

export default ExportLogButton;