import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo_bps from "../../assets/logo_bps.png";
import { createGuest, getGuestById, getVisits } from "../../service/api/api.js";
import StepperNav from "../elements/StepperNav.jsx";
import LoadingOverlay from "../core/LoadingOverlay.jsx";
import PersonalInfoStep from "../elements/PersonalInfoStep.jsx";
import PurposeStep from "../elements/PurposeStep.jsx";

const GuestForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    guest_name: "",
    gender: "L",
    identity_type: "",
    custom_identity_type: "",
    custom_target_service: "",
    identity_number: "",
    institution: "",
    phone: "",
    purpose: "",
    target_service: "pelayanan statistik terpadu",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingPreviousSubmission, setCheckingPreviousSubmission] =
    useState(true);

  useEffect(() => {
    const checkPreviousSubmission = async () => {
      const guestId = localStorage.getItem("last_guest_id");
      const targetService = localStorage.getItem("last_target_service");

      if (!guestId) {
        setCheckingPreviousSubmission(false);
        return;
      }

      try {
        const guestRes = await getGuestById(guestId);
        const guest_name = guestRes.data.guest_name;

        const visitsRes = await getVisits();
        const allVisits = visitsRes.data;

        // Ambil kunjungan terakhir dari guest
        const guestVisits = allVisits.filter(
          (v) => v.guest_id === parseInt(guestId)
        );
        guestVisits.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        const thisVisit = guestVisits[0];

        if (!thisVisit) {
          setCheckingPreviousSubmission(false);
          return;
        }

        if (thisVisit.mark !== "hadir") {
          const { queue_number, timestamp, purpose } = thisVisit;

          const stateData = {
            guest_name,
            target_service: targetService,
            queue_number,
            timestamp,
            purpose,
          };

          if (
            targetService === "Kunjungan Dinas" ||
            targetService === "other"
          ) {
            navigate("/queue-kunjungan-dinas", {
              state: stateData,
              replace: true,
            });
          } else {
            navigate("/nomor-antrian", {
              state: stateData,
              replace: true,
            });
          }
          return;
        } else {
          localStorage.removeItem("last_guest_id");
          localStorage.removeItem("last_target_service");
        }
      } catch (err) {
        console.error("Gagal memeriksa status sebelumnya:", err);
      } finally {
        setCheckingPreviousSubmission(false);
      }
    };

    checkPreviousSubmission();
  }, [navigate]);

  if (checkingPreviousSubmission) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Prepare data with custom fields
      const submitData = {
        ...form,
        // Jika identity_type adalah 'other', gunakan custom_identity_type
        identity_type:
          form.identity_type === "other"
            ? form.custom_identity_type
            : form.identity_type,
        // Jika target_service adalah 'other', gunakan custom_target_service
        target_service:
          form.target_service === "other"
            ? form.custom_target_service
            : form.target_service,
      };

      // Step 1: Submit form dengan data yang sudah dimodifikasi
      const res = await createGuest(submitData);
      const guest_id = res.data.guest_id;

      localStorage.setItem("last_guest_id", guest_id);
      localStorage.setItem("last_target_service", submitData.target_service);

      // Step 2: Get guest details by ID
      const guestRes = await getGuestById(guest_id);
      const guest_name = guestRes.data.guest_name;

      // Step 3: Get visits
      const visitsRes = await getVisits();
      const allVisits = visitsRes.data;

      // Get the visit for this guest
      const thisVisit = allVisits.find((v) => v.guest_id === guest_id);

      if (!thisVisit) throw new Error("Visit tidak ditemukan.");

      const { queue_number, timestamp } = thisVisit;

      // Step 4: Navigate to queue number page
      if (
        form.target_service === "Kunjungan Dinas" ||
        form.target_service === "other"
      ) {
        navigate("/queue-kunjungan-dinas", {
          state: {
            guest_name,
            target_service: submitData.target_service,
            queue_number,
            timestamp,
            purpose: submitData.purpose,
          },
        });
      } else {
        navigate("/nomor-antrian", {
          state: {
            guest_name,
            target_service: submitData.target_service,
            queue_number,
            timestamp,
            purpose: submitData.purpose,
          },
        });
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <LoadingOverlay isLoading={isLoading} />

      {/* Mobile Logo */}
      <div className="lg:hidden bg-white flex justify-center items-center py-6 px-4">
        <img src={logo_bps} alt="Logo BPS" className="w-48 h-auto" />
      </div>

      {/* Desktop Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-AbuAbu flex-col items-center justify-center p-8">
        <div className="mb-8">
          <img src={logo_bps} alt="Logo BPS" className="w-96 h-auto" />
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 lg:w-1/2 bg-white flex flex-col h-screen scroll-container lg:justify-center">
        <StepperNav
          currentStep={currentStep}
          handleStepChange={handleStepChange}
          isStep1Valid={
            form.guest_name && form.identity_number && form.phone && form.email
          }
        />

        <div className="flex-1 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-full sm:max-w-xl md:max-w-xl lg:max-w-2xl px-4 py-6">
            <div className="space-y-2">
              {currentStep === 1 && (
                <PersonalInfoStep
                  form={form}
                  handleChange={handleChange}
                  handleNext={handleNext}
                />
              )}

              {currentStep === 2 && (
                <PurposeStep
                  form={form}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
