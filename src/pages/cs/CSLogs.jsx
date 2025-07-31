import React from "react";
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from "react-router-dom";
import { getCSLogs } from "../../service/api/api";
import ExportLogButton from "../../components/export/ExportLogButton";
import SidebarAdmin from "../../components/elements/SidebarAdmin";

const CSLogs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const {
    data: logs = [],
    isLoading,
  } = useQuery({
    queryKey: ['cslogs'],
    queryFn: getCSLogs,
    staleTime: 1000 * 60 * 5,
    retry: false,
    onError: (err) => {
      console.error("Gagal mengambil log CS:", err);
      if (err.response?.status === 403) navigate('/403');
      else if (err.response?.status === 405) navigate('/405');
      else if (err.response?.status === 500) navigate('/500');
      else alert("Gagal mengambil log CS. Silakan coba lagi.");
    }
  });

  return (
    <div className="flex h-screen bg-gray-100 font-poppins">
      <SidebarAdmin />
      <main className="flex-1 overflow-auto p-8 font-poppins">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Log Aktivitas Customer Service</h1>
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-4">
            <ExportLogButton />
          </div>
        </section>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {isLoading ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Log</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
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
