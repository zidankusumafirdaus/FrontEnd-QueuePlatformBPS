import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo_bps from '../../assets/logo_bps.png';
// Importing from service
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
      const thisVisit = allVisits.find(v => v.guest_id === guest_id);

      if (!thisVisit) throw new Error("Visit tidak ditemukan.");

      const { queue_number, timestamp, target_service } = thisVisit;

      // Step 4: Navigate to queue number page
      navigate("/queue-number", {
        state: {
          guest_name,
          target_service,
          queue_number,
          timestamp,
        },
      });
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Logo and Title */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <div className="mb-8">
           <img src={logo_bps} alt="Logo BPS" className="w-100 h-auto" />
          {/* Logo */}
          {/* Title */}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-1/2 bg-white p-8">
        <div className="max-w-md mx-auto">
          {/* Step indicator */}
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                1
              </div>
              <span className={`ml-2 font-medium ${
                currentStep === 1 ? 'text-blue-500' : 'text-gray-500'
              }`}>Data Diri</span>
            </div>
            <div className="flex items-center ml-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                2
              </div>
              <span className={`ml-2 font-medium ${
                currentStep === 2 ? 'text-blue-500' : 'text-gray-500'
              }`}>Keperluan</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap*
                  </label>
                  <input
                    type="text"
                    name="guest_name"
                    placeholder="Nama"
                    value={form.guest_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Pilih Jenis Kelamin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Jenis Kelamin*
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="">Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                {/* Nomor Telpon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telpon*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telepon"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Jenis Identitas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Identitas*
                  </label>
                  <select
                    name="identity_type"
                    value={form.identity_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Identitas*
                  </label>
                  <input
                    type="text"
                    name="identity_number"
                    placeholder="Nomor Identitas"
                    value={form.identity_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Asal Instansi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asal Instansi/Perusahaan/Lembaga*
                  </label>
                  <input
                    type="text"
                    name="institution"
                    placeholder="Instansi"
                    value={form.institution}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Next Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Lanjut
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Tujuan Kunjungan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tujuan Kunjungan*
                  </label>
                  <select
                    name="target_service"
                    value={form.target_service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="pelayanan statistik terpadu">Pelayanan Statistik Terpadu (PST)</option>
                    <option value="">Kunjungan Dinas</option>
                    <option value="">Other....</option>
                  </select>
                </div>

                {/* Catatan */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes || ''}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div> */}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {/* Hidden inputs for target service */}
            {/* <input
              type="hidden"
              name="target_service"
              value={form.target_service}
              onChange={handleChange}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;