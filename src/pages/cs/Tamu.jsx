import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Import services, utils & components
import { getAllGuests } from "../../service/api/api";
import { DeleteGuest } from "../../utils/DeleteGuest";
import ExportGuestButton from "../../components/export/ExportGuestButton";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import FilterElements from "../../components/guest/FilterElements";
import GuestTable from "../../components/tables/GuestTable";

const Tamu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [detailModal, setDetailModal] = useState({
    show: false,
    content: "",
    label: "",
  });

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [identityTypeFilter, setIdentityTypeFilter] = useState("");

  // Fetch data tamu
  const {
    data: guestsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-guests"],
    queryFn: getAllGuests,
    staleTime: 1000 * 60 * 5,
    onError: (err) => {
      const status = err?.response?.status;
      if (status === 403) navigate("/403");
      else if (status === 405) navigate("/405");
      else if (status === 500) navigate("/500");
    },
  });

  // Filter & search logic
  const filteredGuests = useMemo(() => {
    if (!guestsData?.data) return [];

    return guestsData.data.filter((guest) => {
      const matchesName = guest.guest_name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesGender = !genderFilter || guest.gender === genderFilter;
      const matchesIdentityType =
        !identityTypeFilter || guest.identity_type === identityTypeFilter;

      return matchesName && matchesGender && matchesIdentityType;
    });
  }, [guestsData?.data, searchName, genderFilter, identityTypeFilter]);

  // Dropdown options
  const genderOptions = useMemo(() => {
    if (!guestsData?.data) return [];
    return [...new Set(guestsData.data.map((guest) => guest.gender))].filter(
      Boolean
    );
  }, [guestsData?.data]);

  const identityTypeOptions = useMemo(() => {
    if (!guestsData?.data) return [];
    return [
      ...new Set(guestsData.data.map((guest) => guest.identity_type)),
    ].filter(Boolean);
  }, [guestsData?.data]);

  // Delete confirm
  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    const result = await DeleteGuest(selectedGuestId);
    if (result.success) {
      toast.success("Tamu berhasil dihapus.");
      queryClient.invalidateQueries(["all-guests"]);
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#00AEEF] drop-shadow-sm">
            Data Semua Tamu
          </h1>
          <ExportGuestButton />
        </div>

        {/* Filter */}
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

        {/* Table */}
        <GuestTable
          isLoading={isLoading}
          isError={isError}
          guestsData={guestsData}
          filteredGuests={filteredGuests}
          setDetailModal={setDetailModal}
          setSelectedGuestId={setSelectedGuestId}
          setShowConfirm={setShowConfirm}
          showConfirm={showConfirm}
          handleConfirmDelete={handleConfirmDelete}
          detailModal={detailModal}
        />

        {/* Toast notification */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </main>
    </div>
  );
};

export default Tamu;