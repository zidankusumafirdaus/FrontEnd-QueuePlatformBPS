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
    setIsLoading(true);
    try {
      const res = await createGuest(form);
      const guest_id = res.data.guest_id;

      const guestRes = await getGuestById(guest_id);
      const guest_name = guestRes.data.guest_name;

      const visitsRes = await getVisits();
      const allVisits = visitsRes.data;

      const thisVisit = allVisits.find((v) => v.guest_id === guest_id);

      if (!thisVisit) throw new Error("Visit tidak ditemukan.");

      const { queue_number, timestamp, target_service } = thisVisit;

      navigate("/nomor-antrian", {
        state: {
          guest_name,
          target_service,
          queue_number,
          timestamp,
          purpose: form.purpose,
        },
      });
    } catch (err) {
      const status = err.response?.status;

      if (status === 403) {
        navigate("/403");
      } else if (status === 405) {
        navigate("/405");
      } else if (status === 500) {
        navigate("/500");
      } else {
        alert("Terjadi kesalahan: " + (err.response?.data?.message || err.message));
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
      <div className="hidden lg:flex lg:w-1/2 bg-white flex-col items-center justify-center p-8">
        <div className="mb-8">
          <img src={logo_bps} alt="Logo BPS" className="w-56 h-auto" />
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 lg:w-1/2 bg-white flex flex-col">
        <div className="bg-white border-b border-gray-200 p-2 lg:p-3">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <button
                  onClick={() => handleStepChange(1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    currentStep === 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500 hover:bg-gray-400"
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => handleStepChange(1)}
                  className={`ml-2 text-sm ${
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    currentStep === 2
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500 hover:bg-gray-400"
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => handleStepChange(2)}
                  className={`ml-2 text-sm ${
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

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-md mx-auto space-y-2">
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-small text-gray-700 mb-1">
                      Nama Lengkap*
                    </label>
                    <input
                      type="text"
                      name="guest_name"
                      value={form.guest_name}
                      onChange={handleChange}
                      placeholder="Masukkan Nama Lengkap"
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Jenis Kelamin*
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                      required
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Nomor Telepon*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Telepon"
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Jenis Identitas*
                    </label>
                    <select
                      name="identity_type"
                      value={form.identity_type}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                      required
                    >
                      <option value="">Pilih Jenis Identitas</option>
                      <option value="KTP">KTP</option>
                      <option value="SIM">SIM</option>
                      <option value="Paspor">Paspor</option>
                      <option value="Kartu Mahasiswa">Kartu Mahasiswa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Nomor Identitas*
                    </label>
                    <input
                      type="text"
                      name="identity_number"
                      value={form.identity_number}
                      onChange={handleChange}
                      placeholder="Nomor Identitas"
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
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
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
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
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Tujuan Kunjungan*
                    </label>
                    <select
                      name="target_service"
                      value={form.target_service}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                    >
                      <option value="pelayanan statistik terpadu">
                        Pelayanan Statistik Terpadu (PST)
                      </option>
                      <option value="Kunjungan Dinas">Kunjungan Dinas</option>
                      <option value="">Lainnya...</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Memproses..." : "Submit"}
                    </button>
                  </div>
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
