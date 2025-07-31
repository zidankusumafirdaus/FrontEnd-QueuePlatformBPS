import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const ErrorButton = () => {
    const navigate = useNavigate();

    return (
        <div className="flex gap-4 justify-center">
            <a
            href="/BPS-BukuTamu"
            className="inline-flex items-center bg-[#00AEEF] hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Beranda
            </a>
            <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center border border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
            </button>
        </div>
    )
}