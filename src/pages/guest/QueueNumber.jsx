import React from "react";
import { useLocation } from "react-router-dom";

const QueueNumber = () => {
  const { state } = useLocation();
  const { guest_name, target_service, queue_number } = state || {};

  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      <h1>Nomor Antrian</h1>
      <p>Nama: {guest_name}</p>
      <p>Layanan: {target_service}</p>
      <p>Nomor Antrian: {queue_number}</p>
      <p>Tanggal: {date}</p>
      <p>Waktu: {time}</p>
    </div>
  );
};

export default QueueNumber;
