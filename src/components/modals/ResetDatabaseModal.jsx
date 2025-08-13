import React from "react";
import ConfirmModal from "../guest/ConfirmModal";
import { resetDatabase } from "../../service/api/api";
import { toast } from "react-toastify";

const ResetDatabaseModal = ({ show, onClose }) => {
  const handleConfirm = async () => {
    try {
      await resetDatabase();
      toast.success("Database berhasil direset!", { position: "top-right" });
    } catch {
      toast.error("Terjadi kesalahan saat mereset database.", { position: "top-right" });
    } finally {
      onClose();
    }
  };

  return (
    <ConfirmModal
      show={show}
      onClose={onClose}
      onConfirm={handleConfirm}
      message={
        <>
          Yakin ingin menghapus semua data kunjungan dari{" "}
          <span className="text-red-500 font-bold">Database</span>?{" "}
          Tindakan ini tidak dapat dibatalkan!
        </>
      }
      modalTitle="Konfirmasi"
    />
  );
};

export default ResetDatabaseModal;
