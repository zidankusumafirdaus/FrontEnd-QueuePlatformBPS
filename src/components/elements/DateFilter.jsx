import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { id } from "date-fns/locale";

const DateFilter = ({ selectedDate, setSelectedDate }) => {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <div className="flex items-center gap-6">
        <label className="text-[#222] flex items-center text-lg">
          <FaCalendarAlt className="mr-3 text-[#00AEEF]" />
          Filter Tanggal:
        </label>
        <div className="flex items-center gap-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Klik untuk pilih tanggal"
            dateFormat="dd MMMM yyyy"
            locale={id}
            className="border-2 border-gray-200 px-4 py-2 rounded-lg shadow-sm focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 transition-all duration-200"
            isClearable
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-[#00AEEF] hover:text-[#0088CC] font-medium hover:underline transition-colors duration-200"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DateFilter;