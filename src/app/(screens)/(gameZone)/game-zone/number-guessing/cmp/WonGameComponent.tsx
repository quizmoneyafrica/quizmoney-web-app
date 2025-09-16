import React, { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { setGameStatus } from "@/app/store/numberGuessGameSlice";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { RefreshCcw } from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

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
    dispatch(setGameStatus("ENDED"));
  };

  return (
    <Fragment>
      <div className=" w-full ">
        <div className=" relative max-w-3xl mx-auto ">
          <div className=" relative ">
            <motion.div
              className=" flex-col relative bg-transparent  w-full flex justify-center items-center z-50"
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 56,
                damping: 14,
                duration: 0.9,
              }}
            >
              {/* Pulsing blurred ring behind the hero */}
              <motion.div
                aria-hidden="true"
                initial={{ scale: 0.94, opacity: 0.16 }}
                animate={{
                  scale: [0.94, 1.18, 0.94],
                  opacity: [0.16, 0.6, 0.16],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "48%",
                  transform: "translateX(-50%)",
                  width: "min(520px, 88vw)",
                  height: "min(520px, 88vw)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,245,180,0.24) 0%, rgba(255,200,60,0.12) 28%, rgba(34,197,94,0.04) 56%, transparent 72%)",
                  filter: "blur(36px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              <div className=" flex flex-col top-20  items-center justify-center relative">
                <div className=" absolute flex-col flex items-center justify-center  bottom-0">
                  <img
                    src="/icons/stars.svg"
                    alt="stars"
                    className="  h-32 md:h-44 z-50   "
                  />
                </div>
                <div className=" absolute uppercase flex-col flex z-50 items-center justify-center  bottom-0">
                  <span className=" text-white text-base mt-5  text-center ">
                    CONGRATS <br />
                    <span className="text-xl text-shadow-2xs text-shadow-primary-700 font-bold">
                      You Won
                    </span>
                  </span>
                </div>
                <img
                  src="/icons/sunShine.svg"
                  alt="sunshine"
                  className="h-32 md:h-44 relative mb-16 "
                />
              </div>

              <img
                src="/icons/ribon-b.svg"
                alt="Out of Trials"
                className=" h-28 md:h-36 z-10"
              />
            </motion.div>

            <div className="pt-20  pb-8 text-center relative mx-auto max-w-lg md:w-[40%] w-[80%] bg-transparent  overflow-hidden">
              <div className=" bg-[#E4F1FA] flex-col flex gap-3  rounded-3xl  h-fit    relative py-20 px-5 -mt-32  ">
                <div className=" w-full flex-col flex">
                  <p className="text-[#3386CE] font-bold  mb-12 text-lg md:text-2xl mt-6 ">
                    You guessed the correct number
                    <br />
                    number
                  </p>
                  <div className=" w-full flex items-center justify-center gap-2 flex-col">
                    <img src="/icons/trophy2.svg" alt="Trophy" className="" />
                    <span className="text-[#05B4FF] font-bold text-base md:text-xl">
                      reward
                    </span>
                    <span className="text-primary-800 text-shadow-2xs font-bold text-xl md:text-2xl">
                      ₦10,000
                    </span>
                  </div>
                </div>
              </div>
              <motion.div
                className="space-y-5 pt-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setGameStatus("START"));
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
        </div>
      </div>
    </Fragment>
  );
}
