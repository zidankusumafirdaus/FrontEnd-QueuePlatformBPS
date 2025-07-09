import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing the createGuest, getGuestById, and getVisits functions from the API service
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <form onSubmit={handleSubmit}>
      {/* form like before */}
      <h2>Form Tamu</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="guest_name" placeholder="Nama" onChange={handleChange} required />
      <select name="gender" onChange={handleChange}>
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>
      <input name="identity_type" placeholder="Jenis Identitas" onChange={handleChange} required />
      <input name="identity_number" placeholder="Nomor Identitas" onChange={handleChange} required />
      <input name="institution" placeholder="Instansi" onChange={handleChange} required />
      <input name="phone" placeholder="Telepon" onChange={handleChange} required />
      <input name="purpose" placeholder="Keperluan" onChange={handleChange} required />
      <input name="target_service" placeholder="Tujuan Layanan" onChange={handleChange} required />
      <button type="submit">Kirim</button>
    </form>
  );
};

export default GuestForm;
