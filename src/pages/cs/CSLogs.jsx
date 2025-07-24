import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaUsers, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';

// Importing from service, utils & components
import { getCSLogs } from "../../service/api/api";
import { LogoutPage } from "../../utils/LogoutPage";
import ExportLogButton from "../../components/export/ExportLogButton";

const CSLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getCSLogs(token);
        setLogs(res.data);
      } catch (error) {
        console.error("Gagal mengambil log CS:", error);
        alert("Gagal mengambil log CS. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="mb-8 pt-3 text-center">
          <span className="text-3xl font-bold text-white">Admin Panel</span>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/visit")}
            className={`
              w-full text-left py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-3
              ${isActive("/visit") ? "bg-gray-700 text-white font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaClipboardList className="text-xl" />
            <span>Data Kunjungan</span>
          </button>
          
          <button
            onClick={() => navigate("/all-guests")}
            className={`
              w-full text-left py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-3
              ${isActive("/all-guests") ? "bg-gray-700 text-white font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaUsers className="text-xl" />
            <span>Semua Tamu</span>
          </button>

          <button
            onClick={() => navigate("/cslogs")}
            className={`
              w-full text-left py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-3
              ${isActive("/cslogs") ? "bg-gray-700 text-white font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaChartBar className="text-xl" />
            <span>Log CS</span>
          </button>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={() => LogoutPage(navigate)}
            className="w-full text-left py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center space-x-3"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Log Aktivitas Customer Service</h1>
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-4">
            <ExportLogButton />
          </div>
        </section>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">Memuat data log...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-base">
              Tidak ada data log aktivitas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID Log
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Admin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID Admin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Waktu
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => {
                    const dateObj = new Date(log.timestamp);
                    const tanggal = dateObj.toLocaleDateString("id-ID");
                    const waktu = dateObj.toLocaleTimeString("id-ID", {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    });

                    return (
                      <tr key={log.log_id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.log_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.admin_env}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.admin_id !== null ? log.admin_id : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tanggal} <br /> {waktu}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CSLogs;