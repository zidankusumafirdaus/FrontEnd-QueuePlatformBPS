import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full py-20 px-4 bg-white border-t-2 border-b-2 border-[#1E3A8A]">
      <div className="max-w-4xl mx-auto text-center justify-items-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-[#00B6D9]">Temukan.</span>
          <span className="text-[#1E3A8A]"> Simpan.</span>
          <span className="text-[#3B82F6]"> Bagikan.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#1E3A8A] mb-8 leading-relaxed">
          Cobalah untuk selalu menghargai apapun itu. Karena terkadang sesuatu akan jauh lebih berharga saat kita kehilangannya. 
        </p>
        <p className="text-sm italic text-[#1E3A8A] mb-8 leading-relaxed text-right">
          No. 121219 — Raihan Rizky Arsandy
        </p>
        <button
          className="mt-4 px-8 py-4 bg-[#1E3A8A] text-white text-lg font-semibold rounded-full shadow hover:bg-[#3B82F6] transition-colors"
          onClick={() => navigate("/")}
        >
          Masuk Sekarang
        </button>
      </div>
    </section>
  );
};

export default CTASection;
