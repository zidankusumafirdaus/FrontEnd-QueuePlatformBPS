import React from "react";

// Importing from service
import { exportVisits } from "../../service/api/api";

const ExportVisitButton = () => {
  const downloadVisitFile = async () => {
    try {
      const res = await exportVisits();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_kunjungan.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Gagal mengunduh data kunjungan.");
      console.error(err);
    }
  };

  return <button onClick={downloadVisitFile}>Export Kunjungan</button>;
};

export default ExportVisitButton;
