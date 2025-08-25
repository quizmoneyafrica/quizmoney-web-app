import React from "react";
import { useAppSelector } from "@/app/hooks/useAuth";
import { motion } from "framer-motion";

function CoinTarget() {
  const { balance } = useAppSelector((state) => state.coin);
  const targetStep = 1500;
  const nextTarget =
    balance > 0 ? Math.ceil(balance / targetStep) * targetStep : targetStep;
  const prevTarget = nextTarget - targetStep;
  const progress = ((balance - prevTarget) / targetStep) * 100;
  return (
    <div className="bg-white p-4 rounded-[20px] w-full space-y-4">
      <p className="font-medium text-base text-left">Next QMC Target</p>
      <div className="w-full h-3 bg-[#F2F2F2] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#0BC502]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="grid grid-cols-2 text-sm">
        <p className="text-left">{Math.floor(progress)}% Complete</p>
        <p className="text-right">
          {balance}/{nextTarget} points
        </p>
      </div>
    </div>
  );
}

export default CoinTarget;
