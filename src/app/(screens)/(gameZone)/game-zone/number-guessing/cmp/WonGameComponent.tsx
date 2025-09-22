import React, { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  setExtraTrialBought,
  setGameStatus,
  setTrials,
} from "@/app/store/numberGuessGameSlice";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { RefreshCcw } from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/app/utils/utils";
import Image from "next/image";
import { setCurrentGameData, setZonePhase } from "@/app/store/gameZoneSlice";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
};

const buttonItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
};

export default function WonGameComponent() {
  const dispatch = useAppDispatch();
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handlePlayAgain = () => {
    // start the spin animation for 1.5s
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setSpinning(true);
    timerRef.current = window.setTimeout(() => {
      setSpinning(false);
      timerRef.current = null;
    }, 1500);
    dispatch(setGameStatus("START"));
    dispatch(setTrials(3));
    dispatch(setZonePhase("game"));
    dispatch(setExtraTrialBought(0));
    dispatch(
      setCurrentGameData({
        gameId: "",
        name: "",
        description: "",
        type: "NUMBER_GUESSER",
        config: {
          minimumStake: 1000,
          maximumStake: 1000000,
        },
      })
    );
  };

  return (
    <Fragment>
      <div>
        <div className="space-y-5 pt-[12em]">
          <div className="relative pb-2">
            <div className="w-full absolute -top-[7.3em] z-[1]">
              <Image
                src="/icons/sunshine.svg"
                alt="sunshine"
                className="w-full absolute -top-[7.3em] z-[1]"
                width={100}
                height={100}
                quality={100}
              />
            </div>
            <div className="w-full absolute -top-[6.3em] z-[3]">
              <Image
                src="/icons/stars.svg"
                alt="stars"
                className="w-full absolute -top-[6.3em] z-[3]"
                width={100}
                height={100}
                quality={100}
              />
            </div>
            <div className="relative">
              <Image
                src="/icons/ribon-b.svg"
                alt="Out of Trials"
                className="w-full absolute -top-24 z-[2]"
                width={100}
                height={100}
                quality={100}
              />
              <div className="absolute flex flex-col items-center justify-center inset-0 z-[4] uppercase -top-[5em] text-white">
                <p className="font-bold font-anton text-lg">Congrats</p>
                <h2 className="font-bold !font-anton stroke-primary-900 stroke-2 drop-shadow text-4xl [text-shadow:_0px_2px_0px_rgb(0_212_252_/_1.00)]">
                  You won
                </h2>
              </div>
            </div>

            <div className="px-8 font-anton">
              <div className="pt-18 pb-10 bg-[#E4F1FA] w-full px-4 rounded-b-3xl">
                <p className="text-center font-bold text-2xl text-primary-700">
                  You guessed the <br />
                  correct number
                </p>
                <div className="grid place-items-center gap-1 py-5">
                  <Image
                    src="/icons/trophy2.svg"
                    alt="Trophy"
                    className=""
                    width={60}
                    height={60}
                    quality={100}
                  />
                </div>
                <div className="hidden">
                  <p className="text-secondary-600 font-bold text-center uppercase">
                    reward
                  </p>
                  <p className="text-primary-800 text-3xl font-bold text-center">
                    {formatNaira(Number(5000))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <motion.div
            className="space-y-5 px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                dispatch(setGameStatus("START"));
                dispatch(setTrials(3));
                dispatch(setZonePhase("zone"));
                dispatch(setExtraTrialBought(0));
                redirect("/wallet");
              }}
              variants={buttonItem}
              className="w-full bg-gradient-to-r from-blue-400 to-[#2A75BC] hover:from-[#2A75BC] hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform"
            >
              <span className="text-xl tracking-wide font-bold">
                GO TO WALLET
              </span>
            </motion.button>
            <motion.button
              variants={buttonItem}
              onClick={() => {
                handlePlayAgain();
              }}
              className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform flex items-center justify-center space-x-3"
            >
              <RefreshCcw
                className={cn(
                  " text-[#ffffff] w-6 h-6",
                  spinning ? "animate-[spin_1.5s_linear_infinite]" : ""
                )}
              />

              <span className="text-xl tracking-wide font-bold">
                PLAY AGAIN
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </Fragment>
  );
}
