import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-xl mt-4">Halaman tidak ditemukan.</p>
      <Link to="/BPS-BukuTamu" className="text-blue-500 underline mt-4 block">Kembali ke Beranda</Link>
    </div>
  );
};

export default NotFound;
