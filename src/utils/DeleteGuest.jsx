import React from "react";
import { deleteGuest } from "../service/api/api";

export const DeleteGuest = async (guest_id) => {
  try {
    await deleteGuest(guest_id);
    return { success: true };
  } catch (err) {
    console.error("Gagal menghapus tamu:", err);
    return { success: false };
  }
};
