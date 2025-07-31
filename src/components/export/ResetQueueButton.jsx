import React from "react";
import { FaRedo } from "react-icons/fa";


import { ResetQueue } from "../../utils/ResetQueue";
import { useNavigate } from "react-router-dom";

const ResetQueueButton = ({ onClick, className = "", confirm }) => {
  const navigate = useNavigate ? useNavigate() : () => {};

  const handleClick = async (e) => {
    if (confirm) {
      try {
        await ResetQueue();
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
      className={`px-5 py-1 bg-[#00AEEF] text-white rounded-md hover:bg-[#008bef] transition font-poppins text-sm font-medium flex items-center justify-center gap-2 shadow ${className}`}
    >
      <FaRedo className="text-lg" />
      Reset Antrian
    </button>
  );
};

export default ResetQueueButton;
