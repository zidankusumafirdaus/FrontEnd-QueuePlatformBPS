// Importing from Services
import { resetQueue } from "../service/api/api";

export const ResetQueue = async () => {
    const confirmReset = window.confirm("Yakin ingin mereset nomor antrian?");
    if (!confirmReset) return;

    try {
        const token = localStorage.getItem("token");
        await resetQueue(token);
        alert("Nomor antrian berhasil direset.");
        window.location.reload();
    } catch (error) {
        console.error("Gagal mereset antrian:", error);
        alert("Gagal mereset antrian.");
    }
};