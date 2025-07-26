import React from "react";
import { deleteGuest } from "../service/api/api";

export const DeleteGuest = async (guest_id, setGuests, guests) => {
  const originalGuests = [...guests];
  setGuests((prev) => prev.filter((guest) => guest.guest_id !== guest_id));

  try {
    const token = localStorage.getItem("token");
    await deleteGuest(guest_id, token);
    return { success: true };
  } catch (err) {
    console.error("Gagal menghapus tamu:", err);
    setGuests(originalGuests); // rollback
    return { success: false };
  }
};

