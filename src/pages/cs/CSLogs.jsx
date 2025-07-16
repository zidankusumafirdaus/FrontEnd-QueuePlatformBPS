import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing from service & components
import { getCSLogs } from "../../service/api/api";
import ExportLogButton from "../../components/export/ExportLogButton";

const CSLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getCSLogs(token);
        setLogs(res.data);
      } catch (error) {
        console.error("Gagal mengambil log CS:", error);
        alert("Gagal mengambil log CS.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Log Aktivitas Customer Service</h1>
      <button onClick={() => navigate("/visit")}>Kembali</button>
      <ExportLogButton />
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>Tidak ada data log.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID Log</th>
              <th>Aksi</th>
              <th>Admin</th>
              <th>ID Admin</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const dateObj = new Date(log.timestamp);
              const tanggal = dateObj.toLocaleDateString("id-ID");
              const waktu = dateObj.toLocaleTimeString("id-ID");

              return (
                <tr key={log.log_id}>
                  <td>{log.log_id}</td>
                  <td>{log.action}</td>
                  <td>{log.admin_env}</td>
                  <td>{log.admin_id !== null ? log.admin_id : "—"}</td>
                  <td>{tanggal} {waktu}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CSLogs;
