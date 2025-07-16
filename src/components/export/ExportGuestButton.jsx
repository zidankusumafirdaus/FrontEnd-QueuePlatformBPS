import React from "react";

// Importing from service
import { exportGuests } from "../../service/api/api";

const ExportGuestButton = () => {
  const downloadGuestFile = async () => {
    try {
      const res = await exportGuests();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_tamu.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Gagal mengunduh data tamu.");
      console.error(err);
    }
  };

  return <button onClick={downloadGuestFile}>Export Tamu</button>;
};

export default ExportGuestButton;
