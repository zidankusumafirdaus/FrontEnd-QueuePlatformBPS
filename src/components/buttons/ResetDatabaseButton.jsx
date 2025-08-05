import React from "react";
import { FaTrash } from "react-icons/fa";
import { ResetDatabase } from "../../utils/ResetDatabase";
import { useNavigate } from "react-router-dom";

const ResetDatabaseButton = ({ onClick, className = "", confirm }) => {
  const navigate = useNavigate ? useNavigate() : () => {};

  const handleClick = async (e) => {
    if (confirm) {
      try {
        await ResetDatabase();
        if (onClick) onClick(e);
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          if (status === 403) navigate("/403");
          else if (status === 405) navigate("/405");
          else if (status === 500) navigate("/500");
        }
      }
    } else {
      if (onClick) onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-1 bg-[#F87171] text-white rounded-md hover:bg-[#ff4444] transition font-poppins font-medium text-sm flex items-center justify-center gap-2 shadow ${className}`}
    >
      <FaTrash className="text-lg" />
      Hapus Semua Antrian
    </button>
  );
};

export default ResetDatabaseButton;
