import React, { useState } from "react";
import {
  StepIndicator,
  PersonalInfoStep,
  DocumentUploadStep,
  ReviewStep,
  SuccessScreen,
  FormData,
} from "./KYCComponents";
import PhoneVerification from "./PhoneVerification";
import OTPVerification from "./OTPVerification";
import BvnVerification from "./BvnVerification";

// Main KYC Verification Component
const KYCVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    documentType: "",
    uploadedFile: "",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

  const handleSubmit = (): void => {
    setIsSubmitted(true);
  };

  const handleReset = (): void => {
    setCurrentStep(1);
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      documentType: "",
      uploadedFile: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4  sm:py-8  lg:px-8">
      <div className="max-w-2xl mx-auto">
        {!isSubmitted && (
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        )}

        <div className=" w-full">
          {isSubmitted ? (
            <SuccessScreen onReset={handleReset} />
          ) : (
            <>
              {currentStep === 1 && <PhoneVerification onNext={handleNext} />}

              {currentStep === 2 && (
                <BvnVerification onNext={handleNext} onBack={handleBack} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
