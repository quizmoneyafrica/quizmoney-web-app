"use client";
import { IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function KycContinue() {
  const router = useRouter();
  const handleStartKyc = () => {
    router.push("/kyc");
  };
  return (
    <div className="bg-warning-50 p-6 rounded-t-[10px] border-b-4 border-warning-900 grid md:grid-cols-3 gap-3 ">
      <div className="w-full flex gap-3 md:col-span-2">
        <div>
          <div className="bg-warning-900 rounded-full h-10 w-10 text-white grid place-items-center">
            <IdCard />
          </div>
        </div>
        <div>
          <h3 className="text-warning-900">Complete KYC Verification</h3>
          <p className="text-sm">
            Almost there! Complete your KYC now to enjoy Quiz Money without
            limits.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end w-full">
        <button
          onClick={handleStartKyc}
          className="border border-[#ed7c2b40] bg-white px-4 py-1.5 rounded-[4px] text-warning-900 text-sm font-medium"
        >
          Setup Now
        </button>
      </div>
    </div>
  );
}

export default KycContinue;
