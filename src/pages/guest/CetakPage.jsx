import React from "react";
import logo_bps from "../../assets/logo_bps.png";

const CetakPage = ({ queueData }) => {
  const {
    guest_name = "Nama Tamu",
    target_service = "Layanan",
    queue_number = "001",
    purpose = ""
  } = queueData || {};

  // Generate date seperti di QueueNumber.jsx
  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full h-screen bg-white p-8 font-poppins" id="print-content">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-[#00B4D8] pb-6">
        <div className="flex justify-center items-center gap-4 mb-4">
          <img src={logo_bps} alt="Logo BPS" className="w-20 h-auto" />
          <div className="text-left">
            <h1 className="text-2xl font-bold text-[#00B4D8]">
              BADAN PUSAT STATISTIK
            </h1>
            <p className="text-gray-600 text-sm">REPUBLIK INDONESIA</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">TIKET ANTRIAN TAMU</h2>
      </div>

      {/* Queue Number - Main Focus */}
      <div className="text-center mb-8">
        <h1 className="text-[#00B4D8] text-3xl font-bold mb-4">
          NOMOR ANTRIAN
        </h1>
        <div className="inline-block bg-[#00B4D8] rounded-2xl p-8 shadow-lg">
          <span className="text-white text-8xl font-bold">
            {queue_number}
          </span>
        </div>
      </div>

      {/* Guest Information */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
          INFORMASI TAMU
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="bg-[#00B4D8] inline-block px-4 py-2 rounded-lg mb-2">
              <p className="text-white text-sm font-medium">Nama Tamu</p>
            </div>
            <p className="text-gray-800 font-bold text-lg">{guest_name}</p>
          </div>
          
          <div>
            <div className="bg-[#99D98C] inline-block px-4 py-2 rounded-lg mb-2">
              <p className="text-white text-sm font-medium">Tanggal Kunjungan</p>
            </div>
            <p className="text-gray-800 font-bold text-lg">{date}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="bg-[#F77F00] inline-block px-4 py-2 rounded-lg mb-2">
            <p className="text-white text-sm font-medium">Tujuan Kunjungan</p>
          </div>
          <p className="text-gray-800 font-bold text-lg">{target_service}</p>
        </div>
      </div>

      {/* Purpose/Notes */}
      {purpose && (
        <div className="bg-[#FFF3CD] rounded-lg p-4 mb-6 border border-[#FFEAA7]">
          <h3 className="text-[#856404] font-bold mb-2">
            CATATAN PENGUNJUNG:
          </h3>
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-[#856404] text-sm">{purpose}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
        <h3 className="text-[#00B4D8] font-bold mb-2">PETUNJUK:</h3>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>• Harap simpan tiket ini dengan baik</li>
          <li>• Tunggu panggilan nomor antrian Anda</li>
          <li>• Tunjukkan tiket ini kepada petugas saat dipanggil</li>
          <li>• Jika ada pertanyaan, hubungi petugas di meja informasi</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-gray-300 pt-4">
        <p className="text-gray-700 font-medium mb-1">
          Harap menunggu panggilan nomor antrian
        </p>
        <p className="text-[#00B4D8] font-bold text-lg">
          TERIMA KASIH ATAS KUNJUNGAN ANDA
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Dicetak pada: {new Date().toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
};

export default CetakPage;