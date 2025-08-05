import React, { useState, useEffect } from "react";
import { FaChartBar, FaUsers, FaSignOutAlt, FaClipboardList, FaDownload, FaChevronLeft, FaBars, FaStar, FaBell, FaCalendarAlt, FaUserCircle, FaCog, FaEye } from "react-icons/fa";
import { LogoutPage } from "../../utils/LogoutPage";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Kunjungan", icon: <FaClipboardList />, path: "/visit-guest", tooltip: "Data Kunjungan" },
  { label: "Tamu", icon: <FaUsers />, path: "/all-guests", tooltip: "Data Semua Tamu" },
  { label: "Export", icon: <FaDownload />, path: "/weekly-exports", tooltip: "Export" },
  { label: "Log CS", icon: <FaChartBar />, path: "/cslogs-BukuTamu", tooltip: "Log CS" },
  { label: "Antrian", icon: <FaEye />, path: "/antrian-tamu", tooltip: "Antrian Tamu" }, 
];

const bottomNav = [
  { label: "Logout", icon: <FaSignOutAlt />, path: "/logout", tooltip: "Logout", isLogout: true },
];

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true";
  });
  const [menuActive, setMenuActive] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSidebarToggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", !prev);
      return !prev;
    });
  };

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const handleMenuToggle = () => setMenuActive((prev) => !prev);

  const handleLogout = () => LogoutPage(navigate);

  return (
    <aside
      className={`transition-all duration-300 font-poppins
        ${collapsed ? "w-20" : "w-64"}
        bg-white text-gray-800 flex flex-col p-0 shadow-xl rounded-r-2xl border-r border-gray-100 min-h-screen h-full`}
    >
      <div className="flex items-center h-16 px-2 border-b border-gray-100 select-none transition-all duration-300">
        <span
          className={`text-xl font-bold text-[#00AEEF] tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 font-poppins ${collapsed ? "hidden" : "opacity-100 w-auto ml-2"}`}
          style={{
            minWidth: collapsed ? 0 : undefined,
            maxWidth: collapsed ? 0 : 200,
            display: collapsed ? "none" : "inline-block",
            textAlign: "left",
          }}
        >
          Admin Panel
        </span>
        <div className="flex-1 transition-all duration-300" />
        <div className="flex items-center gap-2 h-full transition-all duration-300">
          <button
            className="toggler sidebar-toggler bg-white border border-gray-200 rounded-lg p-1 shadow hover:bg-blue-50 flex items-center justify-center transition-all duration-300"
            style={{ height: "40px", width: "40px" }}
            onClick={handleSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <FaChevronLeft
              className={`transition-transform duration-300 text-[#00AEEF] ${collapsed ? "rotate-180" : ""}`}
              size={22}
            />
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`flex-1 flex flex-col gap-3 px-2 py-4 ${collapsed ? "items-start" : ""} ${menuActive ? "block" : ""}`}>
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            tooltip={item.tooltip}
            active={isActive(item.path)}
            collapsed={collapsed}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* Separator */}
      <div className="border-t border-gray-200 mx-4 my-2" />
      {/* Bottom nav */}
      <div className={`px-2 pb-4 ${collapsed ? "items-start flex flex-col" : ""}`}>
        <SidebarNavItem
          icon={<FaSignOutAlt />}
          label="Logout"
          tooltip="Logout"
          active={false}
          collapsed={collapsed}
          onClick={handleLogout}
          isLogout
        />
      </div>
    </aside>
  );
};

const SidebarNavItem = ({ icon, label, tooltip, active, collapsed, onClick, isLogout }) => (
  <div className="relative group w-full" >
    <button
      onClick={onClick}
      className={`w-full flex items-center py-2 px-5 rounded-lg transition-all duration-300 text-base font-medium font-poppins
        ${active ? "bg-[#00AEEF] text-white shadow-md" : "hover:bg-blue-50 text-[#00AEEF]"}
        ${collapsed ? "justify-start" : "gap-3 justify-start"} transition-[justify-content] duration-300
        ${isLogout ? "bg-red-50 hover:bg-red-100 text-red-600 mt-2" : ""}`}
      aria-label={label}
    >
      <span className={`text-xl transition-all duration-300 ${active ? "text-white" : isLogout ? "text-red-600" : "text-[#00AEEF]"}`}>{icon}</span>
      <span
        className={`block transition-all duration-300 whitespace-nowrap overflow-hidden
          ${collapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-2"}
          ${isLogout ? "text-red-600" : ""}`}
        style={{ minWidth: collapsed ? 0 : undefined, maxWidth: collapsed ? 0 : 200 }}
      >
        {label}
      </span>
    </button>
    {collapsed && (
      <span className="nav-tooltip absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 bg-white text-[#00AEEF] text-sm rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 border border-gray-100 transition-all duration-200">
        {tooltip}
      </span>
    )}
  </div>
);

export default SidebarAdmin;
