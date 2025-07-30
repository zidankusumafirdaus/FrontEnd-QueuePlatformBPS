import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

// Import from service, utils & components
import { getAllGuests } from "../../service/api/api";
import { DeleteGuest } from "../../utils/DeleteGuest";
import ConfirmModal from "../../components/guest/ConfirmModal";
import ExportGuestButton from "../../components/export/ExportGuestButton";
import SidebarAdmin from "../../components/export/SidebarAdmin";


const GuestListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await getAllGuests();
        setGuests(response.data);
      } catch (err) {
        console.error("Error fetching guests:", err);
        
        if (err.response) {
        const status = err.response.status;
        if (status === 403) {
          navigate('/403');
        } else if (status === 405) {
          navigate('/405');
        } else if (status === 500) {
          navigate('/500');
        } else {
          setError("Gagal memuat data tamu. Silakan coba lagi.");
        }
      } else {
        setError("Tidak dapat terhubung ke server.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchGuests();
  }, [navigate]);

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    const result = await DeleteGuest(selectedGuestId, setGuests, guests);
    if (result.success) {
      toast.success("Tamu berhasil dihapus.");
    } else {
      toast.error("Gagal menghapus tamu. Terjadi kesalahan.");
    }
    setSelectedGuestId(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Data Semua Tamu</h1>
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-4">
            <ExportGuestButton />
          </div>
        </section>
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-600 text-lg">Memuat data tamu...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-10">
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              {guests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-base">
                  Tidak ada data tamu yang tersedia.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Identitas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Identitas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instansi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guests.map((guest) => (
                      <tr key={guest.guest_id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.guest_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.identity_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.identity_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.institution}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedGuestId(guest.guest_id);
                              setShowConfirm(true);
                            }}
                            className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default GuestListPage;