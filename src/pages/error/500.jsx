import React from 'react';
import { ErrorButton } from '../../components/buttons/ErrorButton';

const Error500 = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center space-y-8">
        <div className="text-8xl font-bold text-red-700">500</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-800">Kesalahan Server</h1>
          <p className="text-slate-600">
            Terjadi kesalahan pada server. Silakan coba lagi nanti.
          </p>
        </div>
        <ErrorButton />
      </div>
    </div>
  );
};

export default Error500;
