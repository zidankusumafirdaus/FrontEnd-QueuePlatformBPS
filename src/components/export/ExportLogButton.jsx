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
        px-5 py-2 bg-[#8DC63F] text-white rounded-md hover:bg-[#52ae36] transition font-poppins font-medium text-sm flex items-center justify-center gap-2 shadow
      "
    >
      <Download className="w-5 h-5" />
      Export Log
    </button>
  );
};

export default ExportLogButton;