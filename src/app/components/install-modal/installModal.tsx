"use client";
import React, { useState } from "react";
import StepOne from "./stepOne";
import Modal from "../game/modal/ModalWindow";
import CustomButton from "@/app/utils/CustomBtn";
import { motion } from "framer-motion";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";

function InstallModal() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const [isSeenInstall, setIsSeenInstall] = useState(
    localStorage.getItem("isSeenInstall") === "true"
  );

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      closeModal();
    }
  };
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    closeModal();
  };

  const closeModal = () => {
    setIsSeenInstall(true);
    localStorage.setItem("isSeenInstall", "true");
  };
  return (
    <Modal
      open={!isSeenInstall}
      handleClose={closeModal}
      title="How to install the app to your Home screen"
      showBtns={false}
    >
      <div className="space-y-4">
        <p>
          Enjoy faster access, better performance, when you install our app
          directly to your home screen!
        </p>
        <motion.div layout>
          {currentStep === 0 && <StepOne />}
          {currentStep === 1 && <StepTwo />}
          {currentStep === 2 && <StepThree />}
          {currentStep === 3 && <StepFour />}
          {currentStep === 4 && <StepFive />}
        </motion.div>
        <div className="flex items-center justify-between">
          {currentStep > 0 ? (
            <CustomButton
              variant="outline"
              width="inline"
              size="md"
              onClick={handlePrevStep}
            >
              Back
            </CustomButton>
          ) : (
            <CustomButton
              variant="outline"
              width="inline"
              size="md"
              onClick={handleSkip}
            >
              Skip
            </CustomButton>
          )}
          <CustomButton width="inline" size="md" onClick={handleNextStep}>
            {currentStep === totalSteps - 1 ? "Done" : "Next"}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}

export default InstallModal;
