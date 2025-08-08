import "react-toastify/dist/ReactToastify.css";
import React, { useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Import dari service, utils & components
import { getAllGuests } from "../../service/api/api";
import { DeleteGuest } from "../../utils/DeleteGuest";
import ConfirmModal from "../../components/guest/ConfirmModal";
import ExportGuestButton from "../../components/export/ExportGuestButton";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import FilterElements from "../../components/guest/FilterElements";

const Tamu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [detailModal, setDetailModal] = useState({ show: false, content: "", label: "" });
  
  // Filter dan Search states
  const [searchName, setSearchName] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [identityTypeFilter, setIdentityTypeFilter] = useState("");

  const {
    data: guestsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['all-guests'],
    queryFn: getAllGuests,
    staleTime: 1000 * 60 * 5,
    onError: (err) => {
      const status = err?.response?.status;
      if (status === 403) navigate('/403');
      else if (status === 405) navigate('/405');
      else if (status === 500) navigate('/500');
    }
  });

  // Filter dan search logic
  const filteredGuests = useMemo(() => {
    if (!guestsData?.data) return [];

    return guestsData.data.filter((guest) => {
      const matchesName = guest.guest_name.toLowerCase().includes(searchName.toLowerCase());
      const matchesGender = !genderFilter || guest.gender === genderFilter;
      const matchesIdentityType = !identityTypeFilter || guest.identity_type === identityTypeFilter;
      
      return matchesName && matchesGender && matchesIdentityType;
    });
  }, [guestsData?.data, searchName, genderFilter, identityTypeFilter]);

  // Get unique values for dropdown options
  const genderOptions = useMemo(() => {
    if (!guestsData?.data) return [];
    return [...new Set(guestsData.data.map(guest => guest.gender))].filter(Boolean);
  }, [guestsData?.data]);

  const identityTypeOptions = useMemo(() => {
    if (!guestsData?.data) return [];
    return [...new Set(guestsData.data.map(guest => guest.identity_type))].filter(Boolean);
  }, [guestsData?.data]);

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    const result = await DeleteGuest(selectedGuestId);
    if (result.success) {
      toast.success("Tamu berhasil dihapus.");
      queryClient.invalidateQueries(['all-guests']);
    } else {
      toast.error("Gagal menghapus tamu. Terjadi kesalahan.");
    }
    setSelectedGuestId(null);
  };

  const clearFilters = () => {
    setSearchName("");
    setGenderFilter("");
    setIdentityTypeFilter("");
  };

  return (
    <div className="flex h-screen bg-[#F5F8FA] font-poppins">
      <SidebarAdmin />
      <main className="flex-1 overflow-auto p-8 font-poppins">
        {/* Header dengan Export Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#00AEEF] drop-shadow-sm">Data Semua Tamu</h1>
          </div>
          <div className="flex-shrink-0">
            <ExportGuestButton />
          </div>
        </div>

        {/* Filter Component */}
        <FilterElements
          searchName={searchName}
          setSearchName={setSearchName}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          identityTypeFilter={identityTypeFilter}
          setIdentityTypeFilter={setIdentityTypeFilter}
          genderOptions={genderOptions}
          identityTypeOptions={identityTypeOptions}
          onClearFilters={clearFilters}
          resultCount={filteredGuests.length}
          totalCount={guestsData?.data?.length || 0}
        />

        {/* Table Section */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-[#00AEEF] text-lg font-semibold animate-pulse">Memuat data tamu...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center py-10">
            <p className="text-[#F7941D] text-lg font-semibold">Gagal memuat data tamu. Silakan coba lagi.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="overflow-x-auto">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-base font-medium">
                  {guestsData?.data?.length === 0 
                    ? "Tidak ada data tamu yang tersedia."
                    : "Tidak ada tamu yang sesuai dengan filter pencarian."
                  }
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-[#00AEEF]/10">
                    <tr>
                      <th className="w-[15%] px-3 py-3 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">Nama</th>
                      <th className="w-[15%] px-3 py-3 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">Email</th>
                      <th className="w-[8%] px-3 py-3 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">Gender</th>
                      <th className="w-[12%] px-3 py-3 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">Jenis ID</th>
                      <th className="w-[15%] px-3 py-3 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">No. ID</th>
                      <th className="w-[15%] px-3 py-3 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">Instansi</th>
                      <th className="w-[12%] px-3 py-3 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">Telepon</th>
                      <th className="w-[8%] px-3 py-3 text-left text-xs font-bold text-[#ff4444] uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredGuests.map((guest) => (
                      <tr key={guest.guest_id} className="hover:bg-[#00AEEF]/5 transition h-[52px]">
                        <td 
                          className="px-3 py-4 text-xs text-[#222] font-normal max-w-0 overflow-hidden text-ellipsis cursor-pointer hover:text-[#00AEEF]" 
                          onClick={() => setDetailModal({ show: true, content: guest.guest_name, label: "Nama Lengkap" })}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{guest.guest_name}</div>
                        </td>
                        <td 
                          className="px-3 py-4 text-xs text-[#222] max-w-0 overflow-hidden text-ellipsis cursor-pointer hover:text-[#00AEEF]" 
                          onClick={() => setDetailModal({ show: true, content: guest.email, label: "Email" })}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{guest.email}</div>
                        </td>
                        <td 
                          className="px-3 py-4 text-xs text-[#222] max-w-0 overflow-hidden text-ellipsis cursor-pointer hover:text-[#00AEEF]" 
                          onClick={() => setDetailModal({ show: true, content: guest.gender, label: "Gender" })}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{guest.gender}</div>
                        </td>
                        <td 
                          className="px-3 py-4 text-xs text-[#222] max-w-0 overflow-hidden text-ellipsis cursor-pointer hover:text-[#00AEEF]" 
                          onClick={() => setDetailModal({ show: true, content: guest.identity_type, label: "Jenis Identitas" })}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{guest.identity_type}</div>
                        </td>
                        <td 
                          className="px-3 py-4 text-xs text-[#222] max-w-0 overflow-hidden text-ellipsis cursor-pointer hover:text-[#00AEEF]" 
                          onClick={() => setDetailModal({ show: true, content: guest.identity_number, label: "Nomor Identitas" })}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{guest.identity_number}</div>
                        </td>
                        <td 
                          className="px-3 py-4 text-xs text-[#8DC63F] font-semibold max-w-0 overflow-hidden text-ellipsis cursor-pointer hover:text-[#00AEEF]" 
                          onClick={() => setDetailModal({ show: true, content: guest.institution, label: "Instansi" })}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{guest.institution}</div>
                        </td>
                        <td 
                          className="px-3 py-4 text-xs text-[#222] max-w-0 overflow-hidden text-ellipsis cursor-pointer hover:text-[#00AEEF]" 
                          onClick={() => setDetailModal({ show: true, content: guest.phone, label: "Telepon" })}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{guest.phone}</div>
                        </td>
                        <td className="px-3 py-4 text-xs font-semibold flex gap-2 items-center">
                          <button
                            onClick={() => {
                              setSelectedGuestId(guest.guest_id);
                              setShowConfirm(true);
                            }}
                            className="px-3 py-2 text-sm bg-[#F87171] hover:bg-[#ff4444] text-white rounded-md transition font-bold shadow"
                            title="Hapus Tamu"
                          >
                            <FaTrashAlt />
                          </button>
                          {guest.status === 'tidak hadir' && (
                            <span className="text-[#F87171] bg-[#FEE2E2] px-2 py-1 rounded text-xs font-medium">Tidak Hadir</span>
                          )}
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
      {/* Detail Modal */}
      {detailModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-lg w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#00AEEF] mb-2">{detailModal.label}</h3>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700 text-sm flex-1 break-all">{detailModal.content}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(detailModal.content);
                    toast.success("Teks berhasil disalin!");
                  }}
                  className="px-3 py-2 bg-[#00AEEF] text-white rounded-lg hover:bg-[#0088CC] transition-colors text-xs font-medium"
                >
                  Salin
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setDetailModal({ show: false, content: "", label: "" })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Tamu;
