import React from "react";
import { deleteGuest } from "../service/api/api";

export const DeleteGuest = async (guest_id, setGuests, guests) => {
  const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus tamu ini?");
  if (!confirmDelete) return;

  const originalGuests = [...guests];
  // Optimistically update UI
  setGuests((prev) => prev.filter((guest) => guest.guest_id !== guest_id));

  try {
    const token = localStorage.getItem("token");
    await deleteGuest(guest_id, token);
    alert("Tamu berhasil dihapus.");
  } catch (err) {
    console.error("Gagal menghapus tamu:", err);
    alert("Gagal menghapus tamu. Terjadi kesalahan server atau masalah jaringan.");
    // Rollback if delete failed
    setGuests(originalGuests);
  }
};
