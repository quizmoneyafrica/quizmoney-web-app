"use client";
import React from "react";
import { motion } from "framer-motion";
import CustomButton from "@/app/utils/CustomBtn";

function KickedOut() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="min-h-[100dvh] bg-primary-900 hero flex flex-col items-center justify-center  px-4">
        <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
          <div className="w-full bg-error-50 text-center text-sm border-4 border-error-500 rounded-[10px] px-4 py-4 space-y-4 flex flex-col items-center justify-center">
            <span className="text-5xl">🚫</span>
            <p className="font-semibold text-base text-error-900">
              You&apos;ve been removed from the game
            </p>
            <p className="text-error-800">
              Switching tabs or minimizing the app during a live game violates
              our game rules.
              <br />
              Please make sure to stay on the game screen next time.
            </p>
            <p>
              Tap the button below to go back home.
              <br /> 👇
            </p>

            <a href="/home" className="w-full">
              <CustomButton width="medium">Go Home</CustomButton>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default KickedOut;
