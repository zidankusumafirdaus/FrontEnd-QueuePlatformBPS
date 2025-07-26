import React from "react";

const ConfirmModal = ({ show, onClose, onConfirm }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`
          transform transition-transform duration-300
          ${show ? "scale-100 translate-y-0" : "scale-95 -translate-y-5"}
          bg-white p-6 rounded-lg shadow-lg w-80
        `}
      >
        <h2 className="text-lg font-semibold mb-4">Konfirmasi Penghapusan</h2>
        <p className="mb-6">Apakah Anda yakin ingin menghapus tamu ini?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
