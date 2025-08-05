import React from 'react';
import { ErrorButton } from '../../components/buttons/ErrorButton';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center space-y-8">
        <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-[#00AEEF] to-blue-600 bg-clip-text">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-800">
            Halaman tidak ditemukan
          </h1>
          <p className="text-slate-600">
            Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
        </div>
        <ErrorButton />
      </div>
    </div>
  );
};

export default NotFound;
