"use client";
import React from "react";
import { motion } from "framer-motion";
import CustomButton from "../utils/CustomBtn";
import Link from "next/link";

function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="min-h-[100dvh] bg-primary-900 hero flex flex-col items-center justify-center px-4">
        <div className="w-full mx-auto max-w-lg bg-error-50 text-center text-sm border-4 border-error-500 rounded-[10px] px-4 py-4 space-y-4 flex flex-col items-center justify-center">
          <span className="text-5xl">🚫</span>
          <p className="font-black text-base text-error-900">NO ACCESS</p>

          <Link href="/" className="w-full mt-6">
            <CustomButton width="medium">Return Home</CustomButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Page;
