import "react-toastify/dist/ReactToastify.css"
import "react-datepicker/dist/react-datepicker.css"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import DatePicker from "react-datepicker"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaTrashAlt, FaDownload, FaCalendarAlt, FaFileExcel } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"

import SidebarAdmin from "../../components/layout/SidebarAdmin"
import ConfirmModal from "../../components/guest/ConfirmModal"
import {
  getWeeklyExports,
  downloadWeeklyExport,
  deleteWeeklyExport,
} from "../../service/api/api"

const CACHE_KEY = "weekly_exports_cache"
const CACHE_DURATION = 1000 * 60 * 5

const Export = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const fetchWeeklyExports = async () => {
    try {
      setLoading(true)
      const cached = localStorage.getItem(CACHE_KEY)
      const now = Date.now()

      if (cached) {
        const parsed = JSON.parse(cached)
        if (now - parsed.timestamp < CACHE_DURATION) {
          setFiles(parsed.data)
          setLoading(false)
          return
        }
      }

      const response = await getWeeklyExports()
      const data = response.data || []
      setFiles(data)
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now }))
    } catch (error) {
      console.error("Gagal mengambil data exports:", error)
      toast.error("Gagal mengambil data exports.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (filename) => {
    try {
      const response = await downloadWeeklyExport(filename)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success(`File ${filename} berhasil didownload.`)
    } catch (error) {
      console.error("Gagal mendownload file:", error)
      toast.error("Gagal mendownload file.")
    }
  }

  const confirmDeleteFile = (filename) => {
    setFileToDelete(filename);
    setShowConfirm(true);
  }

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      await deleteWeeklyExport(fileToDelete);
      const updatedFiles = files.filter((file) => file.filename !== fileToDelete);
      setFiles(updatedFiles);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: updatedFiles, timestamp: Date.now() }));
      toast.success("File berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus file:", error);
      toast.error("Gagal menghapus file.");
    } finally {
      setShowConfirm(false);
      setFileToDelete(null);
    }
  }

  const formatDate = (timestamp) => new Date(timestamp * 1000).toLocaleString("id-ID")

  const getDateOnly = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const groupByDate = (files) => {
    return files.reduce((acc, file) => {
      const date = getDateOnly(file.modified)
      if (!acc[date]) acc[date] = []
      acc[date].push(file)
      return acc
    }, {})
  }

  const isSameDate = (date1, date2) =>
    format(date1, "yyyy-MM-dd") === format(date2, "yyyy-MM-dd")

  const groupedFiles = groupByDate(files)
  const filteredGroupedFiles =
    selectedDate === null
      ? groupedFiles
      : Object.fromEntries(
          Object.entries(groupedFiles).filter(([key]) => {
            const fileDate = new Date(key)
            return isSameDate(fileDate, selectedDate)
          })
        )

  useEffect(() => {
    fetchWeeklyExports()
  }, [])

  return (
    <div className="flex h-screen bg-[#F5F8FA] font-poppins">
      <SidebarAdmin />

      <main className="flex-1 overflow-auto p-8 font-poppins">
        <h1 className="text-4xl font-bold mb-8 text-[#00AEEF] drop-shadow-sm">
          Export Mingguan Otomatis
        </h1>

        <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center gap-6">
            <label className="text-[#222] flex items-center text-lg">
              <FaCalendarAlt className="mr-3 text-[#00AEEF]" />
              Filter Tanggal:
            </label>
            <div className="flex items-center gap-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Klik untuk pilih tanggal"
                dateFormat="dd MMMM yyyy"
                locale={id}
                className="border-2 border-gray-200 px-4 py-2 rounded-lg shadow-sm focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 transition-all duration-200"
                isClearable
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-sm text-[#00AEEF] hover:text-[#0088CC] font-medium hover:underline transition-colors duration-200"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-lg">
          {loading ? (
            <div className="flex justify-center py-10">
              <p className="text-[#00AEEF] text-lg font-semibold animate-pulse">
                Memuat data file...
              </p>
            </div>
          ) : Object.keys(filteredGroupedFiles).length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg font-medium">
                Tidak ada file export untuk tanggal tersebut.
              </p>
            </div>
          ) : (
            Object.entries(filteredGroupedFiles)
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([date, filesOnDate]) => (
                <div key={date} className="mb-10 last:mb-0">
                  <h2 className="text-2xl font-bold text-[#8DC63F] mb-6 border-b-2 border-[#8DC63F]/20 pb-2">
                    {date}
                  </h2>
                  <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 font-poppins text-sm">
                      <thead className="bg-[#00AEEF]/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                            Filename
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                            Tanggal & Waktu
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100 text-[#222]">
                        {filesOnDate.map((file, index) => (
                          <tr
                            key={index}
                            className="hover:bg-[#00AEEF]/5 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <FaFileExcel className="text-green-600 text-lg" />
                                {file.filename}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatDate(file.modified)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleDownload(file.filename)}
                                  className="inline-flex items-center px-4 py-2 bg-[#00AEEF] hover:bg-[#0088CC] text-white rounded-lg transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                                >
                                  <FaDownload className="mr-2" />
                                  Download
                                </button>
                                <button
                                  onClick={() => confirmDeleteFile(file.filename)}
                                  className="inline-flex items-center px-4 py-2 bg-[#F87171] hover:bg-[#ff4444] text-white rounded-lg transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                                >
                                  <FaTrashAlt className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
          )}
        </section>
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
  )
}

export default Export
