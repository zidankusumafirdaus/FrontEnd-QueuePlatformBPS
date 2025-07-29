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
    custom_identity_type: "",
    custom_target_service: "",
    identity_number: "",
    institution: "",
    phone: "",
    purpose: "",
    target_service: "pelayanan statistik terpadu",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
    if (form.target_service === "other" && !form.custom_target_service) {
      alert("Harap isi tujuan kunjungan lainnya");
      return;
    }
    if (form.identity_type === "other" && !form.custom_identity_type) {
      alert("Harap isi identitas");
      return;
    }
    setIsLoading(true);
    try {
      const submitData = {
        ...form,
        identity_type:
          form.identity_type === "other"
            ? form.custom_identity_type
            : form.identity_type,
        target_service:
          form.target_service === "other"
            ? form.custom_target_service
            : form.target_service,
        custom_target_service: undefined,
      };
      delete submitData.custom_identity_type;
      delete submitData.custom_target_service;

      const res = await createGuest(submitData);
      const guest_id = res.data.guest_id;

      const guestRes = await getGuestById(guest_id);
      const guest_name = guestRes.data.guest_name;

      const visitsRes = await getVisits();
      const allVisits = visitsRes.data;

      const thisVisit = allVisits.find((v) => v.guest_id === guest_id);

      if (!thisVisit) throw new Error("Visit tidak ditemukan.");

      const { queue_number, timestamp } = thisVisit;

      if (form.target_service === "Kunjungan Dinas") {
        navigate("/queue-kunjungan-dinas", {
          state: {
            guest_name,
            target_service: submitData.target_service,
            queue_number,
            timestamp,
            purpose: submitData.purpose,
          },
        });
      } else {
        navigate("/nomor-antrian", {
          state: {
            guest_name,
            target_service: submitData.target_service,
            queue_number,
            timestamp,
            purpose: submitData.purpose,
          },
        });
      }
    } catch (err) {
      const status = err.response?.status;

      if (status === 403) {
        navigate("/403");
      } else if (status === 405) {
        navigate("/405");
      } else if (status === 500) {
        navigate("/500");
      } else {
        alert(
          "Terjadi kesalahan: " + (err.response?.data?.message || err.message)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Memproses data...</p>
          </div>
        </div>
      )}

      {/* Mobile Logo */}
      <div className="lg:hidden bg-white flex justify-center items-center py-6 px-4">
        <img src={logo_bps} alt="Logo BPS" className="w-48 h-auto" />
      </div>

      {/* Desktop Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-AbuAbu flex-col items-center justify-center p-8">
        <div className="mb-8">
          <img src={logo_bps} alt="Logo BPS" className="w-96 h-auto" />
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 lg:w-1/2 bg-white flex flex-col h-screen scroll-container lg:justify-center">
        {/* Stepper Navbar di luar container form, full width */}
        <div className="w-full bg-white flex justify-center items-center pt-0 pb-0">
          <div className="w-full">
            <div className="flex w-full overflow-hidden shadow-sm border border-blue-100">
              {/* Step 1: gunakan RTL agar rounded di kiri */}
              <div dir="rtl" className="flex-1">
                <button
                  onClick={() => handleStepChange(1)}
                  className={`w-full flex items-center gap-2 justify-center py-2 transition-all duration-200
                    ${currentStep === 1
                      ? "bg-gradient-to-r from-[#b7d6f8] to-[#4fc3f7] text-white font-bold"
                      : "bg-[#ffffff] text-[#b0b5c3] font-semibold"}
                    ${currentStep === 1 ? "rounded-s-3xl" : ""} focus:outline-none`}
                >
                  <span className="text-base font-bold">Data Diri</span>
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                    ${currentStep === 1 ? "bg-white text-[#4fc3f7]" : "bg-[#e3eafc] text-[#b0b5c3]"}
                  `}>1</span>
                </button>
              </div>
              {/* Step 2: gunakan LTR agar rounded di kanan */}
              <div dir="ltr" className="flex-1">
                <button
                  onClick={() => handleStepChange(2)}
                  className={`w-full flex items-center gap-2 justify-center py-2 transition-all duration-200
                    ${currentStep === 2
                      ? "bg-gradient-to-r from-[#4fc3f7] to-[#3b9be7] text-white font-bold"
                      : "bg-[#ffffff] text-[#b0b5c3] font-semibold"}
                    ${currentStep === 2 ? "rounded-s-3xl" : ""} focus:outline-none`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                    ${currentStep === 2 ? "bg-white text-[#3b9be7]" : "bg-[#e3eafc] text-[#b0b5c3]"}
                  `}>2</span>
                  <span className="text-base">Keperluan</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Container form */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-full sm:max-w-xl md:max-w-xl lg:max-w-2xl px-4 py-6">
            <div className="space-y-2">
              {currentStep === 1 && (
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
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                      required
                    />
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
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-small text-gray-700 mb-2">
                      Pilih Jenis Kelamin*
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base"
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
                      Nomor Telpon*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Telepon"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-small text-gray-700 mb-2">
                      Jenis Identitas*
                    </label>
                    <select
                      name="identity_type"
                      value={form.identity_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 lg:px-4 lg:py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 12px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "16px",
                      }}
                      required
                    >
                      <option value="KTP">KTP</option>
                      <option value="SIM">SIM</option>
                      <option value="Paspor">Paspor</option>
                      <option value="Kartu Mahasiswa">Kartu Mahasiswa</option>
                      <option value="other">Lainnya</option>
                    </select>

                    {form.identity_type === "other" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          name="custom_identity_type"
                          value={form.custom_identity_type || ""}
                          onChange={handleChange}
                          placeholder="Masukkan jenis identitas"
                          className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                          required
                        />
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
                      placeholder="Nomor Identitas"
                      value={form.identity_number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Instansi*
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={form.institution}
                      onChange={handleChange}
                      placeholder="Instansi"
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-blue-500 text-white py-1 lg:py-2 px-6 rounded-lg font-small hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm lg:text-base"
                    >
                      Lanjut
                    </button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Catatan
                    </label>
                    <input
                      type="text"
                      name="purpose"
                      value={form.purpose}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-small text-gray-700 mb-2">
                      Tujuan Kunjungan*
                    </label>
                    <select
                      name="target_service"
                      value={form.target_service}
                      onChange={handleChange}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white appearance-none text-sm lg:text-base"
                      // ... style dan lainnya
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
                          className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm lg:text-base"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {currentStep === 2 && (
                    <div className="pt-4">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full bg-blue-500 text-white py-1 lg:py-2 px-6 rounded-lg font-small hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm lg:text-base ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? "Memproses..." : "Submit"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
