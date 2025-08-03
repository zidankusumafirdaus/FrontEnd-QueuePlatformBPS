import React from "react";
import { FaPrint } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import CetakPage from "../../pages/guest/CetakPage"; // Perbaiki path import
import { createRoot } from "react-dom/client";

const CetakButtonAntrian = ({ queueData, className = "" }) => {
  const handlePrint = async () => {
    try {
      // Buat container sementara untuk render komponen
      const printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.top = '-9999px';
      printContainer.style.width = '210mm'; // A4 width
      printContainer.style.minHeight = '297mm'; // A4 height
      document.body.appendChild(printContainer);

      // Render komponen CetakPage ke container
      const root = createRoot(printContainer);
      
      // Promise untuk menunggu render selesai
      await new Promise((resolve) => {
        root.render(<CetakPage queueData={queueData} />);
        setTimeout(resolve, 500); // Beri waktu lebih untuk render
      });

      // Konfigurasi html2pdf
      const opt = {
        margin: [5, 5, 5, 5],
        filename: `tiket-antrian-${queueData?.queue_number || 'xxx'}-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123 // A4 height in pixels at 96 DPI
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF
      const element = printContainer.querySelector('#print-content');
      if (element) {
        await html2pdf().set(opt).from(element).save();
      } else {
        throw new Error('Print content not found');
      }

      // Cleanup
      root.unmount();
      document.body.removeChild(printContainer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mencetak tiket. Silakan coba lagi.');
    }
  };

  return (
    <button
      onClick={handlePrint}
      className={`inline-flex items-center px-6 py-3 bg-[#00B4D8] hover:bg-[#0096c7] text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
    >
      <FaPrint className="mr-2" />
      Cetak Tiket
    </button>
  );
};

export default CetakButtonAntrian;