import React from 'react';
import { ErrorButton } from '../../components/buttons/ErrorButton';

const Error405 = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center space-y-8">
        <div className="text-8xl font-bold text-orange-600">405</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-800">Metode Tidak Diizinkan</h1>
          <p className="text-slate-600">
            Metode HTTP yang digunakan tidak didukung untuk halaman ini.
          </p>
        </div>
        <ErrorButton />
      </div>
    </div>
  );
};

export default Error405;
