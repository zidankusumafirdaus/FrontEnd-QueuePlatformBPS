import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaUsers, FaSignOutAlt, FaTrashAlt, FaClipboardList, FaDownload, FaCalendarAlt } from "react-icons/fa";
import SidebarAdmin from "../../components/elements/SidebarAdmin";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { LogoutPage } from "../../utils/LogoutPage";
import { getWeeklyExports, downloadWeeklyExport, deleteWeeklyExport } from "../../service/api/api";
import { ToastContainer, toast } from "react-toastify";

const StyledWeeklyAutoExports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

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
    new Date(timestamp * 1000).toLocaleString("id-ID");

  const getDateOnly = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const groupByDate = (files) => {
    return files.reduce((acc, file) => {
      const date = getDateOnly(file.modified);
      if (!acc[date]) acc[date] = [];
      acc[date].push(file);
      return acc;
    }, {});
  };

  const isSameDate = (date1, date2) =>
    format(date1, "yyyy-MM-dd") === format(date2, "yyyy-MM-dd");

  const groupedFiles = groupByDate(files);

  const filteredGroupedFiles =
    selectedDate === null
      ? groupedFiles
      : Object.fromEntries(
          Object.entries(groupedFiles).filter(([key]) => {
            const fileDate = new Date(key);
            return isSameDate(fileDate, selectedDate);
          })
        );

  useEffect(() => {
    fetchWeeklyExports();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Export Mingguan Otomatis
        </h1>

        {/* Kalender Picker */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-gray-700 font-medium flex items-center">
            <FaCalendarAlt className="mr-2" />
            Pilih Tanggal:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Klik untuk pilih tanggal"
            dateFormat="dd MMMM yyyy"
            locale={id}
            className="border px-4 py-2 rounded-md shadow-sm"
            isClearable
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          {loading ? (
            <p className="text-gray-600 text-lg">Memuat data file...</p>
          ) : Object.keys(filteredGroupedFiles).length === 0 ? (
            <p className="text-gray-600 text-lg text-center py-6">
              Tidak ada file export untuk tanggal tersebut.
            </p>
          ) : (
            Object.entries(filteredGroupedFiles)
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([date, filesOnDate]) => (
                <section key={date} className="mb-10">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {date}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Filename
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tanggal & Waktu
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filesOnDate.map((file, index) => (
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
                </section>
              ))
          )}
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default StyledWeeklyAutoExports;
