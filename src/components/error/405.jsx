import React from 'react';
import { Link } from 'react-router-dom';

const Error405 = () => (
  <div className="text-center p-10">
    <h1 className="text-4xl font-bold text-orange-600">405 - Metode Tidak Diizinkan</h1>
    <p className="mt-4">Metode HTTP yang digunakan tidak didukung untuk halaman ini.</p>
    <Link to="/BPS-BukuTamu" className="text-blue-500 underline mt-4 block">Kembali ke Beranda</Link>
  </div>
);

export default Error405;
