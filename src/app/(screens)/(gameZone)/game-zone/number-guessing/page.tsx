"use client";
import React from "react";
import { motion } from "framer-motion";
import { CirclePlus, Home, MoveLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { formatNaira } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import StartPage from "./cmp/StartPage";
import StakePage from "./cmp/StakePage";
import InProgress from "./cmp/InProgress";
import ResultScreen from "./cmp/ResultScreen";
import {
  setGameStatus,
  setOpenBuyModal,
} from "@/app/store/numberGuessGameSlice";
import { useWalletBalances } from "@/app/hooks/useWallet";
import OutOfTrialsComponent from "./cmp/OutOfTrialsComponent";
import { cn } from "@/lib/utils";
import QmDrawer from "@/app/components/drawer/drawer";
import PurchaseTrials from "./cmp/PurchaseTrials";
import { store } from "@/app/store/store";
import LostGameComponent from "./cmp/LostGameComponent";
import WonGameComponent from "./cmp/WonGameComponent";

function Page() {
  const numberGuess = useAppSelector((s) => s.numberGuess);
  const { ngnBalance } = useWalletBalances();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const openBuyModal = useAppSelector(
    (s) => s.numberGuess.openBuyModal ?? false
  );

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
    } else if (numberGuess.gameStatus === "LOST") {
      dispatch(setGameStatus("START"));
    } else if (numberGuess.gameStatus === "WON") {
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
        className={cn(
          `w-full min-h-[100dvh] relative px-4 lg:px-10 py-6 space-y-6`,

          numberGuess.gameStatus === "START"
            ? "bg-primary-900 hero"
            : "bg-[#E4F1FA]",

          numberGuess.gameStatus === "PURCHASE_TRIAL" ||
            numberGuess.gameStatus === "LOST" ||
            numberGuess.gameStatus === "WON"
            ? "bg-white"
            : "bg-[#E4F1FA]"
        )}
      >
        {!(
          numberGuess.gameStatus === "WON" ||
          numberGuess.gameStatus === "PURCHASE_TRIAL" ||
          numberGuess.gameStatus === "LOST"
        ) && (
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
                {formatNaira(Number(ngnBalance || 0), true)}
                <CirclePlus width={18} height={18} />
              </button>
            </div>
          </div>
        )}
        {(numberGuess.gameStatus === "LOST" ||
          numberGuess.gameStatus === "WON") && (
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={handleBack}
              className={"bg-transparent"}
            >
              <MoveLeft />
            </button>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => router.push("/home")}
                className=" text-[#2364AA] border border-[#6DB2E4] rounded-full px-4 py-2 bg-[#E4F1FA] font-medium font-text flex items-center gap-1"
              >
                <Home width={18} height={18} />
                Go to Home
              </button>
            </div>
          </div>
        )}
        {/* body  */}
        <div className="w-full">
          {numberGuess.gameStatus === "START" && <StartPage />}
          {numberGuess.gameStatus === "STAKE" && <StakePage />}
          {numberGuess.gameStatus === "INPROGRESS" && <InProgress />}
          {numberGuess.gameStatus === "ENDED" && <ResultScreen />}
          {numberGuess.gameStatus === "LOST" && <LostGameComponent />}
          {numberGuess.gameStatus === "WON" && <WonGameComponent />}
        </div>
        {numberGuess.gameStatus === "PURCHASE_TRIAL" && (
          <OutOfTrialsComponent />
        )}
      </div>
      <QmDrawer
        open={openBuyModal}
        heightClass="h-fit"
        onOpenChange={(open) => store.dispatch(setOpenBuyModal(open))}
        title="Buy Extra Trials"
        titleLeft
        trigger={<></>}
      >
        <PurchaseTrials />
      </QmDrawer>
    </motion.div>
  );
}

export default Page;
