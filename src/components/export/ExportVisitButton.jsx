import React from "react";
import { exportVisits } from "../../service/api/api";
import { Download } from "lucide-react";

const ExportVisitButton = () => {
  const downloadVisitFile = async () => {
    try {
      const res = await exportVisits();

      if (res.data.size === 0) {
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_kunjungan.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <button
      onClick={downloadVisitFile}
      className="
        bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75
        text-lg flex items-center gap-2
      "
    >
      <Download className="w-5 h-5" />
      Export Kunjungan
    </button>
  );
};

export default ExportVisitButton;
