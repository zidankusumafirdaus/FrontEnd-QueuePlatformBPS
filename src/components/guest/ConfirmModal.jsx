import React from "react";
import "./ConfirmModal.css"; // Akan kita buat setelah ini

const ConfirmModal = ({ show, onClose, onConfirm, modalTitle = "Konfirmasi Penghapusan", message = "Apakah Anda yakin ingin menghapus ini?" }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.add('animate-fade-out');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsSuccess(false);
    onConfirm();
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${
        show
          ? "opacity-100 pointer-events-auto bg-white/80"
          : "opacity-0 pointer-events-none bg-white/0"
      }`}
      onClick={onClose}
    >
      <div
        id="modal-content"
        className={`
          relative transform transition-all duration-300 ease-out
          ${show ? "scale-100 translate-y-0" : "scale-95 -translate-y-10"}
          bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-[380px] mx-4
          border border-gray-100
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 animate-fade-in">
              {modalTitle}
            </h2>
            <p className="text-gray-600 mb-8 font-medium animate-fade-in-delayed">
              {message}
            </p>          <div className="flex gap-4 animate-fade-in-delayed-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl 
                font-semibold transition-all duration-200 hover:border-gray-300 hover:bg-gray-50
                transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || isSuccess}
              className={`
                flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200
                relative overflow-hidden group flex items-center justify-center h-12
                ${isSuccess 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
                }
                ${(isLoading || isSuccess) ? 'cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-lg'}
                text-white
              `}
            >
              {isLoading ? (
                <div className="circle-loader"></div>
              ) : isSuccess ? (
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                  </div>
                </div>
              ) : (
                <span className="relative z-10">Hapus</span>
              )}
              {!isLoading && !isSuccess && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 
                  transform scale-x-0 group-hover:scale-x-100 transition-transform 
                  origin-left duration-200">
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
