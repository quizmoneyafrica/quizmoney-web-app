import React, { Fragment, useState } from "react";
import PhoneVerification from "./PhoneVerification";
import BvnVerification from "./BvnVerification";
import { StepIndicator } from "./StepIndicator";
import { useKycStep } from "@/app/hooks/useKycStep";

const KYCVerification: React.FC = () => {
  const { currentStep, refreshKyc } = useKycStep();

  // Optimistic override: after a successful mutation we advance immediately
  // without waiting for the status endpoint to reflect the change (it can lag).
  const [stepOverride, setStepOverride] = useState<"BVN" | null>(null);

  const effectiveStep = stepOverride ?? currentStep;
  const currentStepNumber = effectiveStep === "BVN" ? 2 : 1;
  const totalSteps: number = 2;

  // Called after phone OTP is verified — advance to BVN immediately.
  const handlePhoneVerified = (): void => {
    setStepOverride("BVN");
    refreshKyc(); // Refresh in background so real status eventually syncs
  };

  // Called after BVN is done — just refresh (BvnVerification handles routing).
  const handleBvnNext = (): void => {
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
            {effectiveStep === "PHONE" && (
              <PhoneVerification onNext={handlePhoneVerified} />
            )}
            {effectiveStep === "BVN" && (
              <BvnVerification onNext={handleBvnNext} />
            )}
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
