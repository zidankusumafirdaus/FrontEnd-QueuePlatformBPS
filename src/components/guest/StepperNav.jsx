import React from "react";

const StepperNav = ({ currentStep, handleStepChange, isStep1Valid }) => {
  return (
    <div className="w-full bg-white flex justify-center items-center pt-0 pb-0">
      <div className="w-full">
        <div className="flex w-full overflow-hidden shadow-sm border border-blue-100">
          {/* Step 1 */}
          <div dir="rtl" className="flex-1">
            <button
              onClick={() => handleStepChange(1)}
              className={`w-full flex items-center gap-2 justify-center py-2 transition-all duration-200
                ${
                  currentStep === 1
                    ? "bg-gradient-to-r from-[#b7d6f8] to-[#4fc3f7] text-white font-bold"
                    : "bg-[#ffffff] text-[#b0b5c3] font-semibold"
                }
                ${currentStep === 1 ? "rounded-s-3xl" : ""} focus:outline-none`}
            >
              <span className="text-base font-bold">Data Diri</span>
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                ${
                  currentStep === 1
                    ? "bg-white text-[#4fc3f7]"
                    : "bg-[#e3eafc] text-[#b0b5c3]"
                }
              `}
              >
                1
              </span>
            </button>
          </div>

          {/* Step 2 */}
          <div dir="ltr" className="flex-1">
            <button
              onClick={() => isStep1Valid && handleStepChange(2)}
              disabled={!isStep1Valid}
              className={`w-full flex items-center gap-2 justify-center py-2 transition-all duration-200
                ${
                  currentStep === 2
                    ? "bg-gradient-to-r from-[#4fc3f7] to-[#3b9be7] text-white font-bold"
                    : "bg-[#ffffff] text-[#b0b5c3] font-semibold"
                }
                ${currentStep === 2 ? "rounded-s-3xl" : ""} focus:outline-none
                ${!isStep1Valid ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                ${
                  currentStep === 2
                    ? "bg-white text-[#3b9be7]"
                    : "bg-[#e3eafc] text-[#b0b5c3]"
                }
              `}
              >
                2
              </span>
              <span className="text-base">Keperluan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepperNav;
