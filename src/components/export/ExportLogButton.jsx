import React from "react";

// Importing the exportGuests function from the API service
import { exportLogs } from "../../service/api/api";

const ExportLogButton = () => {
  const downloadLogFile = async () => {
    try {
      const res = await exportLogs();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "log_pengunjung.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Gagal mengunduh log.");
      console.error(err);
    }
  };

  return <button onClick={downloadLogFile}>Export Log</button>;
};

export default ExportLogButton;
