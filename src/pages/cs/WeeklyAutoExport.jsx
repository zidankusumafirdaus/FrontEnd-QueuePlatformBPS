import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaUsers, FaSignOutAlt, FaTrashAlt, FaClipboardList, FaDownload } from "react-icons/fa";

import { LogoutPage } from "../../utils/LogoutPage";
import { getWeeklyExports, downloadWeeklyExport, deleteWeeklyExport, } from "../../service/api/api";
import { ToastContainer, toast } from "react-toastify";

const StyledWeeklyAutoExports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeeklyExports = async () => {
    try {
      setLoading(true);
      const response = await getWeeklyExports();
      setFiles(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data exports:", error);
      toast.error("Gagal mengambil data exports.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await downloadWeeklyExport(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`File ${filename} berhasil didownload.`);
    } catch (error) {
      console.error("Gagal mendownload file:", error);
      toast.error("Gagal mendownload file.");
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Yakin ingin menghapus file: ${filename}?`)) return;
    try {
      await deleteWeeklyExport(filename);
      setFiles((prev) => prev.filter((file) => file.filename !== filename));
      toast.success("File berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus file:", error);
      toast.error("Gagal menghapus file.");
    }
  };

  const formatDate = (timestamp) =>
    new Date(timestamp * 1000).toLocaleString();

  useEffect(() => {
    fetchWeeklyExports();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigate */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="mb-8 pt-3 text-center">
          <span className="text-3xl font-bold">Admin Panel</span>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/visit-guest")}
            className={`w-full text-left py-2 px-4 rounded-md flex items-center space-x-3 transition-colors
              ${isActive("/visit-guest") ? "bg-gray-700 font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaClipboardList className="text-xl" />
            <span>Data Kunjungan</span>
          </button>

          <button
            onClick={() => navigate("/all-guests")}
            className={`w-full text-left py-2 px-4 rounded-md flex items-center space-x-3 transition-colors
              ${isActive("/all-guests") ? "bg-gray-700 font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaUsers className="text-xl" />
            <span>Semua Tamu</span>
          </button>

          <button
            onClick={() => navigate("/weekly-exports")}
            className={`
                w-full text-left py-2 px-4 rounded-md flex items-center space-x-3 transition-colors
                ${isActive("/weekly-exports") ? "bg-gray-700 font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
            >
            <FaDownload className="text-xl" />
            <span>Export</span>
          </button>

          <button
            onClick={() => navigate("/cslogs-BukuTamu")}
            className={`w-full text-left py-2 px-4 rounded-md flex items-center space-x-3 transition-colors
              ${isActive("/cslogs-BukuTamu") ? "bg-gray-700 font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaChartBar className="text-xl" />
            <span>Log CS</span>
          </button>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={() => LogoutPage(navigate)}
            className="w-full text-left py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 flex items-center space-x-3"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Export Mingguan Otomatis
        </h1>

        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          {loading ? (
            <p className="text-gray-600 text-lg">Memuat data file...</p>
          ) : files.length === 0 ? (
            <p className="text-gray-600 text-lg text-center py-6">
              Tidak ada file export mingguan.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(file.modified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                        <button
                          onClick={() => handleDownload(file.filename)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm"
                        >
                          <FaDownload className="inline mr-1" /> Download
                        </button>
                        <button
                          onClick={() => handleDelete(file.filename)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition text-sm"
                        >
                          <FaTrashAlt className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default StyledWeeklyAutoExports;
