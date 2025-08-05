import React, { useState } from "react";

const PurposeStep = ({ form, handleChange, handleSubmit, isLoading }) => {
  const [errors, setErrors] = useState({});

  const validateAndSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    let isValid = true;

    // Validasi purpose wajib diisi
    if (!form.purpose || !form.purpose.trim()) {
      newErrors.purpose = "Catatan wajib diisi";
      isValid = false;
    }

    if (
      form.target_service === "other" &&
      !form.custom_target_service?.trim()
    ) {
      newErrors.custom_target_service = "Tujuan kunjungan wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      handleSubmit(e);
    } else {
      // Scroll ke field yang error
      if (newErrors.custom_target_service) {
        document
          .querySelector('[name="custom_target_service"]')
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      } else if (newErrors.purpose) {
        document.querySelector('[name="purpose"]')?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-small text-gray-700 mb-2">
          Tujuan Kunjungan*
        </label>
        <select
          name="target_service"
          value={form.target_service}
          onChange={handleChange}
          className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base ${
            errors.target_service ? "border-red-500" : "border-gray-300"
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 12px center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "16px",
          }}
        >
          <option value="pelayanan statistik terpadu">
            Pelayanan Statistik Terpadu
          </option>
          <option value="Kunjungan Dinas">Kunjungan Dinas</option>
          <option value="other">Lainnya</option>
        </select>

        {form.target_service === "other" && (
          <div className="mt-2">
            <input
              type="text"
              name="custom_target_service"
              value={form.custom_target_service || ""}
              onChange={handleChange}
              placeholder="Masukkan jenis layanan"
              className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base ${
                errors.custom_target_service
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {errors.custom_target_service && (
              <p className="mt-1 text-sm text-red-600">
                {errors.custom_target_service}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Catatan</label>
        <input
          type="text"
          name="purpose"
          value={form.purpose || ""}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-400 outline-none ${
            errors.purpose ? "border-red-500" : ""
          }`}
          required
        />
        {errors.purpose && (
          <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          onClick={validateAndSubmit}
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-1 lg:py-2 px-6 rounded-lg font-small hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm lg:text-base ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Memproses..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default PurposeStep;
