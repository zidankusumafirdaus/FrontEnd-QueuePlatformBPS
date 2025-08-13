import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import SidebarAdmin from "../../components/layout/SidebarAdmin";
import ConfirmModal from "../../components/guest/ConfirmModal";
import DateFilter from "../../components/elements/DateFilter";
import ExportTable from "../../components/tables/ExportTable";

import {
  getWeeklyExports,
  downloadWeeklyExport,
  deleteWeeklyExport,
} from "../../service/api/api";

const CACHE_KEY = "weekly_exports_cache";
const CACHE_DURATION = 1000 * 60 * 5;

const Export = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const fetchWeeklyExports = async () => {
    try {
      setLoading(true);
      const cached = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (cached) {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < CACHE_DURATION) {
          setFiles(parsed.data);
          setLoading(false);
          return;
        }
      }

      const response = await getWeeklyExports();
      const data = response.data || [];
      setFiles(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now }));
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

  const confirmDeleteFile = (filename) => {
    setFileToDelete(filename);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      await deleteWeeklyExport(fileToDelete);
      const updatedFiles = files.filter(
        (file) => file.filename !== fileToDelete
      );
      setFiles(updatedFiles);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: updatedFiles, timestamp: Date.now() })
      );
      toast.success("File berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus file:", error);
      toast.error("Gagal menghapus file.");
    } finally {
      setShowConfirm(false);
      setFileToDelete(null);
    }
  };

  useEffect(() => {
    fetchWeeklyExports();
  }, []);

  return (
    <div className="flex h-screen bg-[#F5F8FA] font-poppins">
      <SidebarAdmin />

      <main className="flex-1 overflow-auto p-8 font-poppins">
        <h1 className="text-4xl font-bold mb-8 text-[#00AEEF] drop-shadow-sm">
          Export Mingguan Otomatis
        </h1>

        <DateFilter
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        <ExportTable
          files={files}
          loading={loading}
          selectedDate={selectedDate}
          handleDownload={handleDownload}
          confirmDeleteFile={confirmDeleteFile}
        />
      </main>

      <ConfirmModal
        show={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setFileToDelete(null);
        }}
        onConfirm={handleDelete}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Export;
