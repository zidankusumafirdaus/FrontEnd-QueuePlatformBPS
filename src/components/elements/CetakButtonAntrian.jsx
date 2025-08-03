import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";
import CetakPage from "../../pages/guest/CetakPage";
import { createRoot } from "react-dom/client";
import html2pdf from "html2pdf.js";

const CetakButtonAntrian = ({ queueData, className = "" }) => {
  const [format, setFormat] = useState("a4");

  const handlePrint = async () => {
    try {
      const printContainer = document.createElement("div");
      printContainer.style.position = "absolute";
      printContainer.style.left = "-9999px";
      printContainer.style.top = "-9999px";

      // Set ukuran sesuai pilihan
      if (format === "a4") {
        printContainer.style.width = "210mm";
        printContainer.style.minHeight = "297mm";
      } else if (format === "struk") {
        printContainer.style.width = "80mm";
        printContainer.style.minHeight = "150mm";
      }

      document.body.appendChild(printContainer);
      const root = createRoot(printContainer);

      await new Promise((resolve) => {
        root.render(<CetakPage queueData={queueData} />);
        setTimeout(resolve, 500);
      });

      const opt = {
        margin: 5,
        filename: `tiket-antrian-${queueData?.queue_number || 'xxx'}-${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: format === "a4" ? "a4" : [80, 150],
          orientation: "portrait",
        },
      };

      const element = printContainer.querySelector("#print-content");
      if (element) {
        await html2pdf().set(opt).from(element).save();
      } else {
        throw new Error("Print content not found");
      }

      root.unmount();
      document.body.removeChild(printContainer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mencetak tiket. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="mb-2 px-3 py-1 rounded border border-gray-300"
      >
        <option value="a4">Ukuran A4</option>
        <option value="struk">Struk Kecil (80x150 mm)</option>
      </select>
      <button
        onClick={handlePrint}
        className={`inline-flex justify-center items-center px-6 py-3 bg-[#00B4D8] hover:bg-[#0096c7] text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      >
        <FaPrint className="mr-2" />
        Cetak Tiket
      </button>
    </div>
  );
};

export default CetakButtonAntrian;
