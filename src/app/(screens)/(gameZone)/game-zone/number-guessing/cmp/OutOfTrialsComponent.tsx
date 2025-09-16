import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  setGameStatus,
  setOpenBuyModal,
} from "@/app/store/numberGuessGameSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";

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

// Enhanced banner roll-down animation
const bannerVariants = {
  hidden: {
    y: -400,
    rotateX: -90,
    opacity: 0,
    scaleY: 0.1,
  },
  visible: {
    y: 0,
    rotateX: 0,
    opacity: 1,
    scaleY: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 15,
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function OutOfTrialsComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const openBuyModal = useAppSelector(
    (s) => s.numberGuess.openBuyModal ?? false
  );

  const handleSetOpenBuyModal: React.Dispatch<React.SetStateAction<boolean>> = (
    value
  ) => {
    if (typeof value === "function") {
      const fn = value as (prev: boolean) => boolean;
      const newVal = fn(openBuyModal);
      dispatch(setOpenBuyModal(newVal));
    } else {
      dispatch(setOpenBuyModal(value));
    }
  };

  return (
    <Fragment>
      <div className="w-full max-w-lg mx-auto">
        <div className="absolute top-0 left-0 right-0 w-full flex justify-center items-center">
          <motion.img
            src="/icons/outOfTrials.svg"
            alt="Out of Trials"
            className=" z-20 mx-auto h-[35svh]"
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            // Optional: Add the swing animation after roll-down
            // animate={["visible", "swing"]}
            style={{
              transformOrigin: "top center",
              perspective: 1000,
              // Optional: Add a subtle shadow for more banner-like effect
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
            }}
          />
        </div>

        <div className="pt-20 md:pt-10 text-center relative z-10">
          <div className="border-6 md:border-8 border-[#E4F1FA] flex-col flex gap-3 rounded-2xl relative py-20 px-10 mt-[20%] md:mt-[30%] ">
            <p className="text-gray-800 text-lg  font-semibold  mb-12 mt-6 ">
              You&apos;re just one step away from
              <br />
              cracking the number!
            </p>

            <motion.div
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                variants={buttonItem}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 15px 35px rgba(0,0,0,0.2), 0 8px 15px rgba(34, 197, 94, 0.3)",
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                  boxShadow:
                    "0 5px 15px rgba(0,0,0,0.15), 0 2px 8px rgba(34, 197, 94, 0.2)",
                  y: 1,
                }}
                onClick={() => {
                  handleSetOpenBuyModal(true);
                }}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform flex items-center justify-center space-x-3"
                style={{
                  boxShadow:
                    "0 12px 25px rgba(0,0,0,0.15), 0 6px 12px rgba(34, 197, 94, 0.25), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 rgba(0,0,0,0.15)",
                }}
              >
                <span className="text-xl tracking-wide font-bold">
                  BUY EXTRA TRIALS
                </span>
                <motion.img
                  src="/icons/zap.svg"
                  alt="zap"
                  initial={{
                    opacity: 0.92,
                    filter: "drop-shadow(0 0 0 rgba(255,223,99,0))",
                  }}
                  animate={{
                    opacity: [0.92, 1, 0.92],
                    filter: [
                      "drop-shadow(0 0 0 rgba(255,223,99,0))",
                      "drop-shadow(0 0 14px rgba(255,223,99,0.55))",
                      "drop-shadow(0 0 0 rgba(255,223,99,0))",
                    ],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  className="w-7 h-7"
                />
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  handleSetOpenBuyModal(false);
                  dispatch(setGameStatus("START"));
                  router.back();
                }}
                variants={buttonItem}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 15px 35px rgba(0,0,0,0.2), 0 8px 15px rgba(42, 117, 188, 0.3)",
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                  boxShadow:
                    "0 5px 15px rgba(0,0,0,0.15), 0 2px 8px rgba(42, 117, 188, 0.2)",
                  y: 1,
                }}
                className="w-full bg-gradient-to-r from-blue-400 to-[#2A75BC] hover:from-[#2A75BC] hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform"
                style={{
                  boxShadow:
                    "0 12px 25px rgba(0,0,0,0.15), 0 6px 12px rgba(42, 117, 188, 0.25), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 rgba(0,0,0,0.15)",
                }}
              >
                <span className="text-xl tracking-wide font-bold">
                  QUIT GAME
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
