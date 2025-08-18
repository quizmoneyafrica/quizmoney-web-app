"use client";
import React from "react";
import { motion } from "framer-motion";
import { CirclePlus, MoveLeft } from "lucide-react";
import { useAppSelector } from "@/app/hooks/useAuth";
import { formatNaira } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import StartPage from "./cmp/StartPage";

function Page() {
  const numberGuess = useAppSelector((s) => s.numberGuess);
  const wallet = useAppSelector((s) => s.wallet);
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div
        className={`w-full min-h-[100dvh] ${
          numberGuess.gameStatus === "START"
            ? "bg-primary-900 hero"
            : "bg-[#E4F1FA]"
        } px-4 lg:px-10 py-6 space-y-6`}
      >
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => router.back()}
            className={`${
              numberGuess.gameStatus === "START" ? "text-white" : "text-black"
            } font-bold flex items-center gap-1`}
          >
            <MoveLeft />
          </button>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => router.push("/wallet")}
              className="bg-white rounded-full px-4 py-2 text-primary-900 font-medium font-text flex items-center gap-1"
            >
              {formatNaira(Number(wallet.wallet?.availableBalance || 0), true)}
              <CirclePlus width={18} height={18} />
            </button>
          </div>
        </div>
        {/* body  */}
        <div className="w-full">
          s{numberGuess.gameStatus === "START" && <StartPage />}
          {numberGuess.gameStatus === "STAKE" && <StartPage />}
          {numberGuess.gameStatus === "INPROGRESS" && <StartPage />}
          {numberGuess.gameStatus === "ENDED" && <StartPage />}
        </div>
      </div>
    </motion.div>
  );
}

export default Page;
