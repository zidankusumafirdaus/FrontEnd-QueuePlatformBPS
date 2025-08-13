import React from "react";
import ConfirmModal from "../guest/ConfirmModal";

const ResetQueueModal = ({ show, onClose }) => {
  return (
    <ConfirmModal
      show={show}
      onClose={onClose}
      onConfirm={() => {
        const resetQueueBtn = document.querySelector('[data-reset-queue-btn]');
        if (resetQueueBtn) {
          resetQueueBtn.click();
        }
        onClose();
      }}
      message="Yakin ingin mereset nomor antrian saat ini?"
      modalTitle="Konfirmasi"
    />
  );
};

export default ResetQueueModal;
