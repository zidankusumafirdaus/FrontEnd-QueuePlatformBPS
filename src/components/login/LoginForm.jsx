import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing from utility & service 
import { loginCS } from "../../service/api/api";
import { saveToken } from "../../utils/auth";

const LoginForm = () => {
  const [form, setForm] = useState({ admin: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginCS(form);
      saveToken(res.data.token);
      alert("Login berhasil!");
      navigate("/visit");
    } catch (err) {
      alert("Login gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login Admin</h2>
      <input name="admin" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
