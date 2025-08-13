import React from "react";
import ResetCountdown from "../core/CountdownElements";
import ResetQueueButton from "../buttons/ResetQueueButton";
import ExportVisitButton from "../export/ExportVisitButton";
import ResetDatabaseButton from "../buttons/ResetDatabaseButton";

const VisitHeaderSection = ({
  loadingReset,
  nextReset,
  countdown,
  setShowResetQueueModal,
  setShowResetDatabaseModal
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between w-full">
        <h1 className="text-4xl font-bold mb-6 text-[#00AEEF]">Data Kunjungan</h1>
        {loadingReset ? (
          <p className="text-gray-500 self-center">Memuat waktu reset...</p>
        ) : (
          <ResetCountdown nextReset={nextReset} countdown={countdown} />
        )}
      </div>

      <div className="flex space-x-4 justify-between w-full">
        <div className="flex space-x-4">
          <ResetQueueButton onClick={() => setShowResetQueueModal(true)} />
          <ExportVisitButton />
        </div>
        <ResetDatabaseButton onClick={() => setShowResetDatabaseModal(true)} />
      </div>
    </section>
  );
};

export default VisitHeaderSection;
