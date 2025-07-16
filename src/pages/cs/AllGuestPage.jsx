// src/pages/visit/VisitPage.jsx
import React, { useEffect, useState } from "react";
import { getAllGuests, deleteGuest } from "../../service/api/api";
import ExportGuestButton from "../../components/export/ExportGuestButton";

const VisitPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data tamu dari API
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await getAllGuests();
        setGuests(response.data); // Asumsi data dari API berupa array
      } catch {
        setError("Gagal memuat data tamu.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  // Fungsi hapus tamu
  const handleDelete = async (guest_id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus tamu ini?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await deleteGuest(guest_id, token);

      // Hapus dari state agar langsung update di UI
      setGuests((prevGuests) =>
        prevGuests.filter((guest) => guest.guest_id !== guest_id)
      );

      alert("Tamu berhasil dihapus.");
    } catch (err) {
      console.error("Gagal menghapus tamu:", err);
      alert("Gagal menghapus tamu.");
    }
  };

  if (loading) return <p>Memuat data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daftar Tamu</h1>
      <ExportGuestButton />
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Jenis Kelamin</th>
            <th className="border px-4 py-2">Jenis Identitas</th>
            <th className="border px-4 py-2">Nomor Identitas</th>
            <th className="border px-4 py-2">Instansi</th>
            <th className="border px-4 py-2">Telepon</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.guest_id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{guest.guest_name}</td>
              <td className="border px-4 py-2">{guest.email}</td>
              <td className="border px-4 py-2">{guest.gender}</td>
              <td className="border px-4 py-2">{guest.identity_type}</td>
              <td className="border px-4 py-2">{guest.identity_number}</td>
              <td className="border px-4 py-2">{guest.agency}</td>
              <td className="border px-4 py-2">{guest.phone}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(guest.guest_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitPage;
