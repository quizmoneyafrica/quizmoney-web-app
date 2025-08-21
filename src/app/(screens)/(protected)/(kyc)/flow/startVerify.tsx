import React, { Fragment, useState } from "react";
import PhoneVerification from "./PhoneVerification";
import BvnVerification from "./BvnVerification";
import { StepIndicator } from "./StepIndicator";

const KYCVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const totalSteps: number = 2;

  const handleNext = (): void => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4  sm:py-8  lg:px-8">
      <div className="max-w-2xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className=" w-full">
          <Fragment>
            {currentStep === 1 && <PhoneVerification onNext={handleNext} />}
            {currentStep === 2 && <BvnVerification onBack={handleBack} />}
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
