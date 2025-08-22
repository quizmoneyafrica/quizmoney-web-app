"use client";
import { IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CustomImage from "../wallet/CustomImage";
import CustomButton from "@/app/utils/CustomBtn";

function KycStart() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const handleStartKyc = () => {
    setShowModal(true);
  };
  return (
    <>
      <div className="bg-positive-50 p-6 rounded-t-[10px] border-b-4 border-positive-900 grid md:grid-cols-3 gap-3 ">
        <div className="w-full flex gap-3 md:col-span-2">
          <div>
            <div className="bg-positive-900 rounded-full h-10 w-10 text-white grid place-items-center">
              <IdCard />
            </div>
          </div>
          <div>
            <h3 className="text-positive-900">KYC Verification</h3>
            <p className="text-sm">
              Start your KYC verification today and enjoy Quiz Money seamlessly.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end w-full">
          <button
            onClick={handleStartKyc}
            className="border border-[#00902940] bg-white px-4 py-1.5 rounded-[4px] text-positive-900 text-sm font-medium"
          >
            Setup Now
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex bg-white items-center flex-col mx-auto px-5 overflow-y-auto justify-center h-screen">
          <CustomImage className="mb-4" src={"/icons/kyc.svg"} alt="kyc-icon" />
          <div className="bg-white max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary-900">
              Verify Your Identity
            </h2>
            <p className="mb-6">
              Complete KYC to unlock withdrawals, bigger rewards, and a secure
              gaming experience. Note: One Time Charge of ₦100
            </p>
            <div className=" py-3 flex-col flex w-full gap-3">
              <CustomButton onClick={() => router.push("/kyc")}>
                Start Verification
              </CustomButton>
              <button
                className=" text-black underline  px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Skip for later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default KycStart;
