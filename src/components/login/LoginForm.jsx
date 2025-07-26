import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing from utility & service
import { loginCS } from "../../service/api/api";
import { saveToken } from "../../utils/auth";
import logoPST from "../../assets/logoPST.png";

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
      navigate("/visit");
    } catch (err) {
      alert("Login gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Kontainer Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logoPST}
            alt="Logo PST"
            className="w-28 h-28 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin" className="sr-only">
              Username
            </label>
            <input
              type="text"
              name="admin"
              id="admin"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg
                       transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;