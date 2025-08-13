import { FaTrashAlt, FaDownload, FaFileExcel } from "react-icons/fa";
import { format } from "date-fns";

const ExportTable = ({
  files,
  loading,
  selectedDate,
  handleDownload,
  confirmDeleteFile
}) => {
  const formatDate = (timestamp) =>
    new Date(timestamp * 1000).toLocaleString("id-ID");

  const groupByDate = (files) => {
    return files.reduce((acc, file) => {
      const dateKey = format(new Date(file.modified * 1000), "yyyy-MM-dd");
      if (!acc[dateKey])
        acc[dateKey] = {
          display: new Date(file.modified * 1000).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          files: [],
        };
      acc[dateKey].files.push(file);
      return acc;
    }, {});
  };

  const isSameDate = (date1, date2) =>
    format(date1, "yyyy-MM-dd") === format(date2, "yyyy-MM-dd");

  const groupedFiles = groupByDate(files);
  const filteredGroupedFiles =
    selectedDate === null
      ? groupedFiles
      : Object.fromEntries(
          Object.entries(groupedFiles).filter(([dateKey]) =>
            isSameDate(new Date(dateKey), selectedDate)
          )
        );

  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg">
      {loading ? (
        <div className="flex justify-center py-10">
          <p className="text-[#00AEEF] text-lg font-semibold animate-pulse">
            Memuat data file...
          </p>
        </div>
      ) : Object.keys(filteredGroupedFiles).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg font-medium">
            Tidak ada file export untuk tanggal tersebut.
          </p>
        </div>
      ) : (
        Object.entries(filteredGroupedFiles)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .map(([dateKey, group]) => (
            <div key={dateKey} className="mb-10 last:mb-0">
              <h2 className="text-2xl font-bold text-[#8DC63F] mb-6 border-b-2 border-[#8DC63F]/20 pb-2">
                {group.display}
              </h2>
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 font-poppins text-sm">
                  <thead className="bg-[#00AEEF]/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                        Filename
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                        Tanggal & Waktu
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 text-[#222]">
                    {group.files.map((file, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#00AEEF]/5 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <FaFileExcel className="text-green-600 text-lg" />
                            {file.filename}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(file.modified)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDownload(file.filename)}
                              className="inline-flex items-center px-4 py-2 bg-[#00AEEF] hover:bg-[#0088CC] text-white rounded-lg transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                            >
                              <FaDownload className="mr-2" />
                              Download
                            </button>
                            <button
                              onClick={() => confirmDeleteFile(file.filename)}
                              className="inline-flex items-center px-4 py-2 bg-[#F87171] hover:bg-[#ff4444] text-white rounded-lg transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                            >
                              <FaTrashAlt className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
      )}
    </section>
  );
};

export default ExportTable;
