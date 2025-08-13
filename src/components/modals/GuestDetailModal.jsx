import React from "react";
import { toast } from "react-toastify";

const GuestDetailModal = ({ show, content, label, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-lg w-full mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#00AEEF] mb-2">{label}</h3>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-700 text-sm flex-1 break-all">{content}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(content);
                toast.success("Teks berhasil disalin!");
              }}
              className="px-3 py-2 bg-[#00AEEF] text-white rounded-lg hover:bg-[#0088CC] transition-colors text-xs font-medium"
            >
              Salin
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailModal;
