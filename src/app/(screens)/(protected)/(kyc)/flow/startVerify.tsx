import React, { Fragment } from "react";
import PhoneVerification from "./PhoneVerification";
import BvnVerification from "./BvnVerification";
import { StepIndicator } from "./StepIndicator";
import { useKycStep } from "@/app/hooks/useKycStep";

const KYCVerification: React.FC = () => {
  const { currentStep, refreshKyc } = useKycStep();

  const currentStepNumber = currentStep === "BVN" ? 2 : 1;

  const totalSteps: number = 2;

  const handleNext = (): void => {
    refreshKyc();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4  sm:py-8  lg:px-8">
      <div className="max-w-2xl mx-auto">
        <StepIndicator
          currentStep={currentStepNumber}
          totalSteps={totalSteps}
        />

        <div className=" w-full">
          <Fragment>
            {currentStep === "PHONE" && (
              <PhoneVerification onNext={handleNext} />
            )}
            {currentStep === "BVN" && <BvnVerification onNext={handleNext} />}
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
