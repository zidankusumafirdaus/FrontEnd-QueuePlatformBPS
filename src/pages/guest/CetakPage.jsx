import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo_bps from "../../assets/logo_bps.png";

const CetakPage = ({ queueData }) => {
  const { guest_name, target_service, queue_number, purpose } = queueData || {};

  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [size, setSize] = useState("a4"); // "a4" or "struk"
  const printRef = useRef();

  const handleDownload = async () => {
    const content = printRef.current;
    const scale = size === "struk" ? 2 : 1.5;

    const canvas = await html2canvas(content, {
      scale: scale,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf =
      size === "struk"
        ? new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [80, canvas.height * 0.264583],
          })
        : new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = {
      width: pdfWidth,
      height: (canvas.height * pdfWidth) / canvas.width,
    };

    pdf.addImage(imgData, "PNG", 0, 0, imgProps.width, imgProps.height);
    pdf.save(`antrian-${queue_number}.pdf`);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      {/* Dropdown + Button */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="a4">Ukuran A4</option>
          <option value="struk">Ukuran Struk (80mm)</option>
        </select>
        <button
          onClick={handleDownload}
          className="bg-[#00B4D8] text-white px-4 py-2 rounded shadow hover:bg-[#0096c7]"
        >
          Download PDF
        </button>
      </div>

      {/* Tiket Antrian */}
      <div
        ref={printRef}
        id="print-content"
        className={`${
          size === "struk" ? "w-[300px]" : "w-full"
        } bg-white p-4 text-sm mx-auto rounded-md shadow-md text-gray-800`}
      >
        {/* Logo & Title */}
        <div className="text-center mb-3">
          <img src={logo_bps} alt="Logo BPS" className="w-32 mx-auto mb-1" />
        </div>

        {/* Nomor Antrian */}
        {queue_number && (
          <div className="text-center mb-3">
            <p className="text-xs font-medium">NOMOR ANTRIAN</p>
            <p className="text-[#0077B6] text-[40px] font-bold leading-none mb-12">
              {queue_number}
            </p>
          </div>
        )}

        {/* Info Pengunjung */}
        <div className="text-xs mb-4 border-t border-b border-gray-300 pt-2 pb-4 text-left">
          <div className="flex justify-between mb-1">
            <span>Nama</span>
            <span className="font-semibold text-right">{guest_name}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tanggal</span>
            <span className="font-semibold text-right">{date}</span>
          </div>
          <div className="flex justify-between">
            <span>Tujuan Kunjungan</span>
            <span className="font-semibold text-right">{target_service}</span>
          </div>
        </div>

        {/* Catatan Pengunjung */}
        {purpose && (
          <div className="bg-[#FFF3CD] border border-[#FFECB5] rounded-lg p-2 pb-1 mb-2 text-left">
            <p className="text-[10px] font-semibold text-[#856404] m-0 leading-none">
              Catatan Pengunjung :
            </p>
            <div className="bg-white border border-dashed border-[#FFD700] mt-2 px-1 flex pb-1 pt-0">
              <p className="text-[#856404] text-[10px] m-0">{purpose}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] border-t border-gray-300 pt-1 mb-0 pb-0">
          <p className="mb-1">Harap menunggu Panggilan nomor antrian</p>
          <p className="text-[#0077B6] font-bold">
            Terima Kasih Atas Kunjungan Anda
          </p>
          <p className="text-gray-400 mt-1 text-[8px] mb-0">
            Dicetak: {new Date().toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CetakPage;
