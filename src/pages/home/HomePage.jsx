import React from 'react';
import { ArrowRight } from 'lucide-react';
import HomeBPS from '../../assets/HomeBPS.jpg';
import { useNavigate } from 'react-router-dom';
import '../../styles/index.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-hidden font-poppins" style={{ height: '100vh', maxHeight: '100vh' }}>
      <img
      src={HomeBPS}
      alt="BPS Sidoarjo"
      className="w-full h-full object-cover object-[68%_center] sm:object-center"
      />

      <div className="absolute top-4 right-4 pt-8 sm:top-10 sm:right-6">
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-black px-4 py-1 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full shadow-md hover:bg-gray-100 transition"
        >
          Login
        </button>
      </div>

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-BiruTerang to-transparent pt-32 sm:pt-48 pb-14 px-6 sm:px-12">
        <div className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-6xl font-bold sm:pb-3">
              Buku Kunjungan Online
            </h1>
            <p className="text-xl sm:text-4xl font-bold">
              Badan Pusat Statistik Sidoarjo
            </p>
          </div>

          <button
            onClick={() => navigate('/guest')}
            className="hidden sm:flex bg-white rounded-full p-3 shadow-md"
          >
            <ArrowRight className="w-10 h-10 text-black" />
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate('/guest')}
        className="sm:hidden absolute bottom-6 right-6 bg-white rounded-full p-3 shadow-md"
      >
        <ArrowRight className="w-6 h-6 text-black" />
      </button>
    </div>
  );
};

export default HomePage;
