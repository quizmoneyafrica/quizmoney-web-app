"use client";
import { IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-white bg-opacity-90">
            <motion.div
              className="flex flex-col mx-auto px-5 overflow-y-auto h-screen w-full items-center justify-center"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <CustomImage
                className="mb-4"
                src={"/icons/kyc.svg"}
                alt="kyc-icon"
              />
              <div className="bg-white max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-primary-900">
                  Verify Your Identity
                </h2>
                <p className="mb-6">
                  Complete KYC to unlock withdrawals, bigger rewards, and a
                  secure gaming experience. Note: One Time Charge of ₦100
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default KycStart;
