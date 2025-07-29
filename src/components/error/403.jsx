import React from 'react';
import { Link } from 'react-router-dom';

const Error403 = () => (
  <div className="text-center p-10">
    <h1 className="text-4xl font-bold text-yellow-600">403 - Akses Ditolak</h1>
    <p className="mt-4">Kamu tidak memiliki izin untuk mengakses halaman ini.</p>
    <Link to="/BPS-BukuTamu" className="text-blue-500 underline mt-4 block">Kembali ke Beranda</Link>
  </div>
);

export default Error403;
