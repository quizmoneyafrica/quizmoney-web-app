"use client";
import React from "react";
import { motion } from "framer-motion";
import { CirclePlus, MoveLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { formatNaira } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import StartPage from "./cmp/StartPage";
import { useWallet } from "@/app/store/walletSlice";
import StakePage from "./cmp/StakePage";
import InProgress from "./cmp/InProgress";
import ResultScreen from "./cmp/ResultScreen";
import { setGameStatus } from "@/app/store/numberGuessGameSlice";

function Page() {
  const numberGuess = useAppSelector((s) => s.numberGuess);
  const { wallet: walletData } = useAppSelector(useWallet);
  const router = useRouter();
  const wallet = walletData.find((w) => w.currency === "NGN")! || {};
  const dispatch = useAppDispatch();

  const handleBack = () => {
    if (numberGuess.gameStatus === "START") {
      router.back();
    } else if (numberGuess.gameStatus === "STAKE") {
      dispatch(setGameStatus("START"));
    } else if (numberGuess.gameStatus === "INPROGRESS") {
      dispatch(setGameStatus("STAKE"));
      // return;
    } else if (numberGuess.gameStatus === "ENDED") {
      dispatch(setGameStatus("START"));
    }
  };
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
            onClick={handleBack}
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
              {formatNaira(Number(wallet?.availableBalance || 0), true)}
              <CirclePlus width={18} height={18} />
            </button>
          </div>
        </div>
        {/* body  */}
        <div className="w-full">
          {numberGuess.gameStatus === "START" && <StartPage />}
          {numberGuess.gameStatus === "STAKE" && <StakePage />}
          {numberGuess.gameStatus === "INPROGRESS" && <InProgress />}
          {numberGuess.gameStatus === "ENDED" && <ResultScreen />}
        </div>
      </div>
    </motion.div>
  );
}

export default Page;
