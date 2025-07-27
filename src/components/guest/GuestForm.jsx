import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo_bps from "../../assets/logo_bps.png";
// Import dari service
import { createGuest, getGuestById, getVisits } from "../../service/api/api";

const GuestForm = () => {
  const [form, setForm] = useState({
    email: "",
    guest_name: "",
    gender: "L",
    identity_type: "",
    identity_number: "",
    institution: "",
    phone: "",
    purpose: "",
    target_service: "pelayanan statistik terpadu",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Submit form
      const res = await createGuest(form);
      const guest_id = res.data.guest_id;

      // Step 2: Get guest details by ID
      const guestRes = await getGuestById(guest_id);
      const guest_name = guestRes.data.guest_name;

      // Step 3: Get visits
      const visitsRes = await getVisits();
      const allVisits = visitsRes.data;

      // Get the visit for this guest
      const thisVisit = allVisits.find((v) => v.guest_id === guest_id);

      if (!thisVisit) throw new Error("Visit tidak ditemukan.");

      const { queue_number, timestamp, target_service } = thisVisit;

      // Step 4: Navigate to queue number page
      navigate("/queue-number", {
        state: {
          guest_name,
          target_service,
          queue_number,
          timestamp,
          purpose: form.purpose, // Add this line
        },
      });
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Logo - Only visible on mobile */}
      <div className="lg:hidden bg-white flex justify-center items-center py-6 px-4">
        <img src={logo_bps} alt="Logo BPS" className="w-48 h-auto" />
      </div>

      {/* Left side - Logo and Title (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white flex-col items-center justify-center p-8">
        <div className="mb-8">
          <img src={logo_bps} alt="Logo BPS" className="w-56 h-auto" />
        </div>
      </div>

      {/* Right side - Form Container */}
      <div className="flex-1 lg:w-1/2 bg-white flex flex-col">
        {/* Fixed Step Navigation */}
        <div className="bg-white border-b border-gray-200 p-2 lg:p-3">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <button
                  onClick={() => handleStepChange(1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-small transition-colors duration-200 ${
                    currentStep === 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500 hover:bg-gray-400"
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => handleStepChange(1)}
                  className={`ml-2 font-small transition-colors duration-200 text-sm lg:text-base ${
                    currentStep === 1
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Data Diri
                </button>
              </div>
              <div className="flex items-center ml-4 lg:ml-8">
                <button
                  onClick={() => handleStepChange(2)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-smalltransition-colors duration-200 ${
                    currentStep === 2
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500 hover:bg-gray-400"
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => handleStepChange(2)}
                  className={`ml-2 font-small transition-colors duration-200 text-sm lg:text-base ${
                    currentStep === 2
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Keperluan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Form Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-md mx-auto">
              {/* Form */}
              <div className="space-y-1.5 lg:space-y-2.5">
                {currentStep === 1 && (
                  <>
                    {/* Nama Lengkap */}
                    <div className="-mt-1.5">
                      <label className="block text-sm font-small text-gray-700 mb-1.5">
                        Nama Lengkap*
                      </label>
                      <input
                        type="text"
                        name="guest_name"
                        placeholder="Masukkan Nama Lengkap"
                        value={form.guest_name}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                        required
                      />
                    </div>

                    {/* Email */}
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
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                        required
                      />
                    </div>

                    {/* Pilih Jenis Kelamin */}
                    <div>
                      <label className="block text-sm font-small text-gray-700 mb-2">
                        Pilih Jenis Kelamin*
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base"
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

                    {/* Nomor Telpon */}
                    <div>
                      <label className="block text-sm font-small text-gray-700 mb-2">
                        Nomor Telpon*
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Telepon"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                        required
                      />
                    </div>

                    {/* Jenis Identitas */}
                    <div>
                      <label className="block text-sm font-small text-gray-700 mb-2">
                        Jenis Identitas*
                      </label>
                      <select
                        name="identity_type"
                        value={form.identity_type}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: "right 12px center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "16px",
                        }}
                        required
                      >
                        <option value="">Jenis Identitas Pengunjung</option>
                        <option value="KTP">KTP</option>
                        <option value="SIM">SIM</option>
                        <option value="Paspor">Paspor</option>
                        <option value="Kartu Mahasiswa">Kartu Mahasiswa</option>
                      </select>
                    </div>

                    {/* Nomor Identitas */}
                    <div>
                      <label className="block text-sm font-small text-gray-700 mb-2">
                        Nomor Identitas*
                      </label>
                      <input
                        type="text"
                        name="identity_number"
                        placeholder="Nomor Identitas"
                        value={form.identity_number}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                        required
                      />
                    </div>

                    {/* Asal Instansi */}
                    <div>
                      <label className="block text-sm font-small text-gray-700 mb-2">
                        Asal Instansi/Perusahaan/Lembaga*
                      </label>
                      <input
                        type="text"
                        name="institution"
                        placeholder="Instansi"
                        value={form.institution}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                        required
                      />
                    </div>

                    {/* Next Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-full bg-blue-500 text-white py-1.5 lg:py-1.5 px-6 rounded-lg font-small hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm lg:text-base"
                      >
                        Lanjut
                      </button>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {/* Catatan */}
                    <div>
                      <label className="block text-sm font-small text-gray-700 mb-2">
                        Catatan
                      </label>
                      <input
                        type="text"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                        required
                      />
                    </div>

                    {/* Tujuan Kunjungan */}
                    <div>
                      <label className="block text-sm font-small text-gray-700 mb-2">
                        Tujuan Kunjungan*
                      </label>
                      <select
                        name="target_service"
                        value={form.target_service}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 lg:px-4 lg:py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: "right 12px center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "16px",
                        }}
                      >
                        <option value="pelayanan statistik terpadu">
                          Pelayanan Statistik Terpadu (PST)
                        </option>
                        <option value="Kunjungan Dinas">Kunjungan Dinas</option>
                        <option value="">Other....</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-1.5 lg:py-3 px-6 rounded-lg font-small hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm lg:text-base"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
