// Importing from Services
import { resetDatabase } from "../service/api/api";

export const ResetDatabase = async () => {
    const confirmReset = window.confirm(
        "Yakin ingin menghapus SEMUA data tamu dan kunjungan? Tindakan ini tidak dapat dibatalkan!"
    );
    if (!confirmReset) return;

    try {
        const token = localStorage.getItem("token");
        await resetDatabase(token);
        alert("Semua data tamu dan kunjungan berhasil dihapus.");
        window.location.reload();
    } catch (error) {
        console.error("Gagal menghapus data:", error);
        alert("Gagal menghapus data.");
    }
};