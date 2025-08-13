import React from "react";
import ConfirmModal from "../guest/ConfirmModal";

const ResetDatabaseModal = ({ show, onClose }) => {
  return (
    <ConfirmModal
      show={show}
      onClose={onClose}
      onConfirm={() => {
        const resetDatabaseBtn = document.querySelector('[data-reset-database-btn]');
        if (resetDatabaseBtn) {
          resetDatabaseBtn.click();
        }
        onClose();
      }}
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
