import React from "react";

const ResetCountdown = ({ nextReset, countdown }) => (
  <div className="mb-4">
    <div className="inline-block text-blue-800 px-4 py-2 rounded shadow">
      <span className="font-semibold font-poppins">Reset Database:</span>{" "}
      {nextReset ? (
        <>
          {countdown.hours} jam {countdown.minutes} menit {countdown.seconds} detik
          {countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 && (
            <span className="ml-2 text-red-600 font-bold">(Reset!)</span>
          )}
        </>
      ) : (
        <span>Memuat countdown...</span>
      )}
    </div>
  </div>
);

export default ResetCountdown;