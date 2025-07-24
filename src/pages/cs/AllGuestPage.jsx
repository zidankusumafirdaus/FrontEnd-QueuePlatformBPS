import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaUsers, FaSignOutAlt, FaTrashAlt, FaClipboardList } from 'react-icons/fa';

// Importing from service, utils & components
import { getAllGuests } from "../../service/api/api";
import { DeleteGuest } from "../../utils/DeleteGuest";
import ExportGuestButton from "../../components/export/ExportGuestButton";
import { LogoutPage } from "../../utils/LogoutPage";

const GuestListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await getAllGuests();
        setGuests(response.data);
      } catch (err) {
        console.error("Error fetching guests:", err);
        setError("Gagal memuat data tamu. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
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
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Data Semua Tamu</h1>
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-4">
            <ExportGuestButton />
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center h-full py-10">
            <p className="text-gray-600 text-lg">Memuat data tamu...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full py-10">
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
                <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis Identitas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nomor Identitas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instansi
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telepon
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guests.map((guest) => (
                      <tr key={guest.guest_id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.guest_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.identity_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.identity_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.institution}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => DeleteGuest(guest.guest_id, setGuests, guests)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <FaTrashAlt/>
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
    </div>
  );
};

export default GuestListPage;