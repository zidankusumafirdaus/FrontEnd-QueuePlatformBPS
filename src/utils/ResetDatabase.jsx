import { resetDatabase } from "../service/api/api";
import { toast } from "react-toastify";

export const ResetDatabase = async () => {
  try {
    const token = localStorage.getItem("token");
    await resetDatabase(token);
    toast.success("Semua data berhasil dihapus!");
    setTimeout(() => window.location.reload(), 2000);
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    toast.error("Gagal menghapus data.");
  }
};
