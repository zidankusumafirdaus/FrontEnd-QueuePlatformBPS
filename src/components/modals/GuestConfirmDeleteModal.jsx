import React from "react";
import ConfirmModal from "../guest/ConfirmModal";

const GuestConfirmDeleteModal = ({ show, onClose, onConfirm }) => {
  return (
    <ConfirmModal
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default GuestConfirmDeleteModal;
