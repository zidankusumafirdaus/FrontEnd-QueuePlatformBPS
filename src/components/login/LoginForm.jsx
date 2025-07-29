import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing from utility & service
import { loginCS } from "../../service/api/api";
import { saveToken } from "../../utils/auth";
import logoPST from "../../assets/logoPST.png";

const LoginForm = () => {
  const [form, setForm] = useState({ admin: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await loginCS(form);
      saveToken(res.data.token);
      navigate("/visit-guest");
    } catch (err) {
      console.log("Login gagal:", err);
      const msg = err.response?.data?.message || err.message;
      setError("Login gagal: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Memproses data...</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logoPST} alt="Logo PST" className="w-28 h-28 object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="admin"
              id="admin"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center -mt-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-600 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
