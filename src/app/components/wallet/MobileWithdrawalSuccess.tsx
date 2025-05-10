import CustomButton from "@/app/utils/CustomBtn";
import { useState } from "react";
import CustomImage from "./CustomImage";

export default function MobileWithdrawalSuccess({
  close,
}: {
  close?: () => void;
}) {
  // Decorative dots
  const coloredDots = [
    { color: "bg-blue-200", top: "top-32", left: "left-32" },
    { color: "bg-green-200", top: "top-36", right: "right-16" },
    { color: "bg-yellow-100", bottom: "bottom-36", left: "left-44" },
    { color: "bg-pink-200", bottom: "bottom-32", right: "right-24" },
  ];

  const handleGoBack = () => {
    if (close) {
      close();
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-between  px-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-yellow-100 flex items-center justify-center">
            <CustomImage src="/icons/success.svg" alt="success-icon" />
          </div>
        </div>

        <h1 className="text-base font-bold text-gray-800 mb-4 text-center">
          Good job!
        </h1>

        <p className="text-[#6D6D6D] text-center mb-8">
          ₦10,000 withdrawal request is in process you will get a notification
          when it's approved
        </p>
      </div>

      <div className="w-full max-w-md">
        <CustomButton
          type="submit"
          onClick={handleGoBack}
          className="bg-primary-900 text-white w-full rounded-full py-4 hover:bg-primary-700"
        >
          Go back
        </CustomButton>
      </div>
    </div>
  );
}
