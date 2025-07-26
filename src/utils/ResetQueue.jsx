import { resetQueue } from "../service/api/api";
import { toast } from "react-toastify";

export const ResetQueue = async () => {
  try {
    const token = localStorage.getItem("token");
    await resetQueue(token);
    toast.success("Nomor antrian berhasil direset!");
    setTimeout(() => window.location.reload(), 2000);
  } catch (error) {
    console.error("Gagal mereset antrian:", error);
    toast.error("Gagal mereset antrian.");
  }
};
