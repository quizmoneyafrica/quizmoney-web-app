import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { setGameStatus } from "@/app/store/numberGuessGameSlice";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { RefreshCcw } from "lucide-react";

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

export default function LostGameComponent() {
  const dispatch = useAppDispatch();

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

              <div className=" flex flex-col md:top-10 top-5  items-center justify-center relative">
                <div className=" absolute flex-col flex items-center justify-center  bottom-0">
                  <img
                    src="/icons/animation.svg"
                    alt="stars"
                    className="  h-10 md:h-20 z-50   "
                  />
                </div>
                <div className=" absolute flex-col flex z-50 items-center justify-center ">
                  <span className=" text-white text-base md:mt-[14rem] mt-36 pt-8 md:pt-0   text-center ">
                    oops!! <br />
                    <span className="md:text-3xl text-2xl text-shadow-2xs text-shadow-primary-700 font-bold">
                      You didn&apos;t Win
                    </span>
                  </span>
                </div>
                <img
                  src="/icons/sunShine.svg"
                  alt="sunshine"
                  className="h-32 md:h-44 relative  "
                />
              </div>

              <img
                src="/icons/ribon-b.svg"
                alt="Out of Trials"
                className=" h-28 md:h-36 z-10"
              />
            </motion.div>

            <div className="pt-20  pb-8 text-center relative mx-auto max-w-lg md:w-[40%] w-[80%] bg-transparent  overflow-hidden">
              <div className=" bg-[#E4F1FA] flex-col flex gap-3  rounded-3xl     relative py-20 px-5 -mt-32  ">
                <p className="text-[#3386CE] font-bold  mb-12 text-lg md:text-2xl mt-6 ">
                  Better Luck Next
                  <br />
                  Game
                </p>

                <motion.div
                  className="space-y-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.button
                    variants={buttonItem}
                    onClick={() => {
                      dispatch(setGameStatus("START"));
                    }}
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
                    className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform flex items-center justify-center space-x-3"
                    style={{
                      boxShadow:
                        "0 12px 25px rgba(0,0,0,0.15), 0 6px 12px rgba(34, 197, 94, 0.25), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 rgba(0,0,0,0.15)",
                    }}
                  >
                    <RefreshCcw className=" text-[#ffffff] w-6 h-6" />

                    <span className="text-xl tracking-wide font-bold">
                      PLAY AGAIN
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
