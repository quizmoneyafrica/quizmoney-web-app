"use client";

import { ArrowLeft, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

interface GameZoneHeaderProps {
  balance: number;
  onTopUp?: () => void;
}

export default function GameZoneHeader({
  balance,
  onTopUp,
}: GameZoneHeaderProps) {
  const router = useRouter();

  return (
    <motion.div
      className="w-full flex justify-between items-center py-3 text-white"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {},
      }}
    >
      {/* Left - Back and Title */}
      <motion.button
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
        aria-label="Go back"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ArrowLeft className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Game zone</h1>
      </motion.button>

      {/* Right - Balance Button */}
      {/* <motion.button
        onClick={onTopUp}
        className="bg-white text-[#17478B] rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold"
        aria-label="Top up balance"
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        <PlusCircle className="w-4 h-4" />
      </motion.button> */}
      <div></div>
    </motion.div>
  );
}
