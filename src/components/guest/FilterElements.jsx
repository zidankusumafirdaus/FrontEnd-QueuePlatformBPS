import React from "react";
import { FaSearch } from "react-icons/fa";

const FilterElements = ({
  searchName,
  setSearchName,
  genderFilter,
  setGenderFilter,
  identityTypeFilter,
  setIdentityTypeFilter,
  genderOptions,
  identityTypeOptions,
  onClearFilters,
  resultCount,
  totalCount
}) => {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Search by Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cari Nama
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] text-sm" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Masukkan nama tamu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] focus:outline-none text-sm hover:border-[#8DC63F] transition-colors"
            />
          </div>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] focus:outline-none text-sm hover:border-[#8DC63F] transition-colors"
          >
            <option value="">Semua Gender</option>
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* Identity Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Identitas
          </label>
          <select
            value={identityTypeFilter}
            onChange={(e) => setIdentityTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] focus:outline-none text-sm hover:border-[#8DC63F] transition-colors"
          >
            <option value="">Semua Jenis</option>
            {identityTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 bg-[#F7941D] hover:bg-[#00AEEF] text-white rounded-lg text-sm font-medium transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="mt-4 text-sm text-[#8DC63F] font-medium">
        Menampilkan {resultCount} dari {totalCount} total tamu
      </div>
    </section>
  );
};

export default FilterElements;