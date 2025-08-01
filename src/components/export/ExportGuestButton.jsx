import React from "react";
import { Download } from "lucide-react";

// Importing from service
import { exportGuests } from "../../service/api/api";

const ExportGuestButton = () => {
  const downloadGuestFile = async () => {
    try {
      const res = await exportGuests();

      // Check if the response contains actual data
      if (res.data.size === 0) {
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_tamu.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <button
      onClick={downloadGuestFile}
      className="
        px-5 py-2 bg-[#8DC63F] text-white rounded-md hover:bg-[#52ae36] transition font-poppins font-medium text-sm flex items-center justify-center gap-2 shadow
      "
    >
      <Download className="w-5 h-5" />
      Export Tamu
    </button>
  );
};

export default ExportGuestButton;