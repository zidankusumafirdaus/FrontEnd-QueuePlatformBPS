import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaUsers, FaSignOutAlt, FaRedo, FaTrash, FaClipboardList } from 'react-icons/fa';

// Importing from utility, & Components
import VisitTable from "../../components/visit/VisitTable";
import ExportVisitButton from "../../components/export/ExportVisitButton";
import { LogoutPage } from "../../utils/LogoutPage";
import { ResetQueue } from "../../utils/ResetQueue";
import { ResetDatabase } from "../../utils/ResetDatabase";

const VisitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="mb-8 pt-3 text-center">
          <span className="text-3xl font-bold text-white">Admin Panel</span>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/visit")}
            className={`
              w-full text-left py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-3
              ${isActive("/visit") ? "bg-gray-700 text-white font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaClipboardList className="text-xl" />
            <span>Data Kunjungan</span>
          </button>
                    
          <button
            onClick={() => navigate("/all-guests")}
            className={`
              w-full text-left py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-3
              ${isActive("/all-guests") ? "bg-gray-700 text-white font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaUsers className="text-xl" />
            <span>Semua Tamu</span>
          </button>
          
          <button
            onClick={() => navigate("/cslogs")}
            className={`
              w-full text-left py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-3
              ${isActive("/cslogs") ? "bg-gray-700 text-white font-bold" : "hover:bg-gray-700 text-gray-300"}
            `}
          >
            <FaChartBar className="text-xl" />
            <span>Log CS</span>
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Data Kunjungan</h1>

        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-4">
            <button
              onClick={ResetQueue}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-lg"
            >
              <FaRedo className="text-lg inline-block mr-2" />
              Reset Antrian
            </button>
            <button
              onClick={ResetDatabase}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-lg"
            >
              <FaTrash className="text-lg inline-block mr-2" />
              Hapus Semua Antrian
            </button>
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