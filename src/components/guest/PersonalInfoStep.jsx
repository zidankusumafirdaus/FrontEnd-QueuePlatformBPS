import React, { useState } from "react";

const PersonalInfoStep = ({ form, handleChange, handleNext }) => {
  const [errors, setErrors] = useState({});

  // Validate phone number to only contain numbers
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleChange({ target: { name: 'phone', value } });
  };

  // Validate identity number to only contain alphanumeric characters
  const handleIdentityNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleChange({ target: { name: 'identity_number', value } });
  };

  // Validate form before proceeding to next step
  const validateAndProceed = () => {
    const newErrors = {};
    let isValid = true;

    // Check required fields
    if (!form.guest_name.trim()) {
      newErrors.guest_name = 'Nama lengkap wajib diisi';
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
      isValid = false;
    }

    if (!form.phone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
      isValid = false;
    } else if (form.phone.length < 10) {
      newErrors.phone = 'Nomor telepon minimal 10 digit';
      isValid = false;
    }

    if (!form.identity_type) {
      newErrors.identity_type = 'Jenis identitas wajib dipilih';
      isValid = false;
    }

    if (form.identity_type === "other" && !form.custom_identity_type?.trim()) {
      newErrors.custom_identity_type = 'Jenis identitas wajib diisi';
      isValid = false;
    }

    if (!form.identity_number) {
      newErrors.identity_number = 'Nomor identitas wajib diisi';
      isValid = false;
    } else if (form.identity_number.length < 5) {
      newErrors.identity_number = 'Nomor identitas terlalu pendek';
      isValid = false;
    }

    if (!form.institution.trim()) {
      newErrors.institution = 'Instansi wajib diisi';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      handleNext();
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-small text-gray-700 mb-2">
          Nama Lengkap*
        </label>
        <input
          type="text"
          name="guest_name"
          value={form.guest_name}
          onChange={handleChange}
          placeholder="Masukkan Nama Lengkap"
          className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-400 outline-none ${
            errors.guest_name ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.guest_name && (
          <p className="mt-1 text-sm text-red-600">{errors.guest_name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-small text-gray-700 mb-2">
          Email*
        </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-small text-gray-700 mb-2">
          Pilih Jenis Kelamin*
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base ${
            errors.gender ? 'border-red-500' : 'border-gray-300'
          }`}
          required
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 12px center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "16px",
          }}
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-small text-gray-700 mb-2">
          Nomor Telepon*
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="Telepon (hanya angka)"
          value={form.phone}
          onChange={handlePhoneChange}
          className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          required
          maxLength="15"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-small text-gray-700 mb-2">
          Jenis Identitas*
        </label>
        <select
          name="identity_type"
          value={form.identity_type}
          onChange={handleChange}
          className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base ${
            errors.identity_type ? 'border-red-500' : 'border-gray-300'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 12px center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "16px",
          }}
          required
        >
          <option value="">Pilih identitas</option>
          <option value="KTP">KTP</option>
          <option value="SIM">SIM</option>
          <option value="Paspor">Paspor</option>
          <option value="Kartu Mahasiswa">Kartu Mahasiswa</option>
          <option value="other">Lainnya</option>
        </select>
        {errors.identity_type && (
          <p className="mt-1 text-sm text-red-600">{errors.identity_type}</p>
        )}

        {form.identity_type === "other" && (
          <div className="mt-2">
            <input
              type="text"
              name="custom_identity_type"
              value={form.custom_identity_type || ""}
              onChange={handleChange}
              placeholder="Masukkan jenis identitas"
              className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base ${
                errors.custom_identity_type ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.custom_identity_type && (
              <p className="mt-1 text-sm text-red-600">{errors.custom_identity_type}</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-small text-gray-700 mb-2">
          Nomor Identitas*
        </label>
        <input
          type="text"
          name="identity_number"
          placeholder="Nomor Identitas (Hanya angka)"
          value={form.identity_number}
          onChange={handleIdentityNumberChange}
          className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base ${
            errors.identity_number ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.identity_number && (
          <p className="mt-1 text-sm text-red-600">{errors.identity_number}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Instansi*</label>
        <input
          type="text"
          name="institution"
          value={form.institution}
          onChange={handleChange}
          placeholder="Instansi"
          className={`w-full px-3 py-2 lg:px-4 lg:py-2 border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base ${
            errors.institution ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.institution && (
          <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={validateAndProceed}
          className="w-full bg-blue-500 text-white py-1 lg:py-2 px-6 rounded-lg font-small hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm lg:text-base"
        >
          Lanjut
        </button>
      </div>
    </>
  );
};

export default PersonalInfoStep;