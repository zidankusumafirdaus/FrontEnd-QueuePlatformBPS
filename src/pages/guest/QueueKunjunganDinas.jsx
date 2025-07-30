import React from "react";
import { useLocation } from "react-router-dom";
import logo_bps from "../../assets/logo_bps.png";

const QueueNumber = () => {
  const { state } = useLocation();
  const { guest_name, target_service, queue_number, purpose } = state || {};

  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Mobile Logo */}
      <div className="lg:hidden w-full flex justify-center items-center p-4">
        <img src={logo_bps} alt="Logo BPS" className="w-48 h-auto" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row mx-auto px-4">
        {/* Desktop Logo */}
        <div className="hidden lg:flex w-full lg:w-1/3 bg-white items-center justify-center p-8">
          <img
            src={logo_bps}
            alt="Logo BPS"
            className="w-64 md:w-56 lg:w-72 xl:w-80"
          />
        </div>

        {/* Queue Content */}
        <div className="flex-1 p-4 lg:p-8 flex flex-col justify-center">
          {/* Info Cards */}
          <div className="flex flex-col gap-3 mb-8">
            {/* Header */}

            {/* Cards Container - Mobile */}
            <div className="bg-Abu rounded-xl p-4 shadow-super lg:hidden">
              <div className="flex flex-col space-y-4">
                {/* Nama dan Tanggal - 2 kolom */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Nama */}
                  <div>
                    <div className="bg-[#00B4D8] inline-block px-3 py-1 rounded-md">
                      <p className="text-white text-sm">Nama</p>
                    </div>
                    <p className="mt-1 text-gray-800 font-medium">
                      {guest_name}
                    </p>
                  </div>

                  {/* Tanggal */}
                  <div>
                    <div className="bg-[#99D98C] inline-block px-3 py-1 rounded-md">
                      <p className="text-white text-sm">Tanggal</p>
                    </div>
                    <p className="mt-1 text-gray-800 font-medium">{date}</p>
                  </div>
                </div>

                {/* Tujuan - Full width */}
                <div>
                  <div className="bg-[#F77F00] inline-block px-3 py-1 rounded-md">
                    <p className="text-white text-sm">Tujuan Kunjungan</p>
                  </div>
                  <p className="mt-1 text-gray-800 font-medium break-words">
                    {target_service}
                  </p>
                </div>
              </div>
            </div>

            {/* Cards Container - Desktop */}
            <div className="hidden lg:grid grid-cols-3 gap-3 mb-8 shadow-sm">
              <div className="bg-[#00B4D8] rounded-lg p-3">
                <p className="text-white text-xs mb-1">Nama</p>
                <p className="text-white font-bold text-sm">{guest_name}</p>
              </div>
              <div className="bg-[#99D98C] rounded-lg p-3">
                <p className="text-white text-xs mb-1">Tanggal</p>
                <p className="text-white font-bold text-sm">{date}</p>
              </div>
              <div className="bg-[#F77F00] rounded-lg p-3">
                <p className="text-white text-xs mb-1">Tujuan Kunjungan</p>
                <p className="text-white font-bold text-sm break-words">
                  {target_service}
                </p>
              </div>
            </div>

            {/* Queue Number - Tidak Berubah */}
            <div className="text-center mb-8 mt-10">
              <h2 className="text-[#00B4D8] text-2xl font-bold">BADAN PUSAT</h2>
              <h2 className="text-[#00B4D8] text-2xl font-bold">STATISTIK</h2>
            </div>
          </div>

          {/* Notes Section */}
          {purpose && (
            <div className="bg-[#FFF3CD] rounded-lg p-4 mb-6">
              <h3 className="text-[#856404] font-medium mb-2 text-sm">
                Catatan Pengunjung :
              </h3>
              <div className="bg-white rounded-lg p-3">
                <p className="text-[#856404] text-sm">{purpose}</p>
              </div>
            </div>
          )}

          {/* Bottom Notice */}
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-1 text-sm">
              Harap menunggu Panggilan nomor antrian
            </p>
            <p className="text-[#00B4D8] font-bold text-sm">
              Terima Kasih Atas Kunjungan Anda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueNumber;
