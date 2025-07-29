import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => (
  <div className="text-center p-10">
    <h1 className="text-4xl font-bold text-red-700">500 - Kesalahan Server</h1>
    <p className="mt-4">Terjadi kesalahan pada server. Silakan coba lagi nanti.</p>
    <Link to="/BPS-BukuTamu" className="text-blue-500 underline mt-4 block">Kembali ke Beranda</Link>
  </div>
);

export default Error500;
