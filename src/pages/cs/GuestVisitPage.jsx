import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaUsers, FaSignOutAlt, FaRedo, FaTrash } from 'react-icons/fa';

// Importing from utility, & Components
import { LogoutPage } from "../../utils/LogoutPage";
import { ResetQueue } from "../../utils/ResetQueue";
import { ResetDatabase } from "../../utils/ResetDatabase";
import VisitTable from "../../components/visit/VisitTable";
import ExportVisitButton from "../../components/export/ExportVisitButton";

const VisitPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold text-white">Admin Panel</span>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/cslogs")}
            className="w-full text-left py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
          >
            <FaChartBar className="text-xl" />
            <span>Lihat Log CS</span>
          </button>
          <button
            onClick={() => navigate("/all-guests")}
            className="w-full text-left py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
          >
            <FaUsers className="text-xl" />
            <span>Lihat Semua Tamu</span>
          </button>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={() => LogoutPage(navigate)}
            className="w-full text-left py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center space-x-3"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Data Kunjungan</h1>

        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manajemen Data</h2>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={ResetQueue}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-lg flex items-center space-x-2"
            >
              <FaRedo className="text-lg" />
              <span>Reset Antrian</span>
            </button>
            <button
              onClick={ResetDatabase}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-lg flex items-center space-x-2"
            >
              <FaTrash className="text-lg" />
              <span>Hapus Semua Data Visit</span>
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Export Data</h3>
            <ExportVisitButton />
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <VisitTable />
        </section>
      </main>
    </div>
  );
};

export default VisitPage;