import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  setOpenBuyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenBuyModal2: React.Dispatch<React.SetStateAction<boolean>>;
}

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

export default function OutOfTrialsComponent({
  setOpenBuyModal,
  setOpenBuyModal2,
}: Props) {
  const router = useRouter();
  return (
    <div className=" w-full">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-16">
          <div className="w-3 h-32 bg-gradient-to-b from-[#1283C3] to-[#002C44] border-l-3 border-r-3 border-l-[#415E6F] border-r-[#415E6F] rounded-b-lg shadow-md"></div>
          <div className="w-3 h-32 bg-gradient-to-b from-[#1283C3] to-[#002C44] border-l-3 border-r-3 border-l-[#415E6F] border-r-[#415E6F] rounded-b-lg shadow-md"></div>
        </div>
      </div>

      <div className="pt-20  pb-8 text-center relative z-10">
        <div className="relative z-10 px-5">
          <div className="border-4 border-[#000000] rounded-2xl overflow-hidden ">
            <div className="bg-[#FBDF63] h-full rounded-xl p-5   border-5 border-[#FFA402]  ">
              <h1 className="text-3xl font-bold text-[#1B1B1B] tracking-wide font-serif">
                Out of Trials
              </h1>
            </div>
          </div>
        </div>

        <div className=" border-6 border-[#E4F1FA] flex-col flex gap-3 rounded-2xl relative py-20 px-5 mt-[-55px] ">
          <p className="text-gray-800  font-medium mb-12 ">
            You're just one step away from
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
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setOpenBuyModal2(false);
                setTimeout(() => {
                  setOpenBuyModal(true);
                }, 300);
              }}
              className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform flex items-center justify-center space-x-3"
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
                  repeat: Infinity, // run forever
                  repeatType: "mirror", // smoothly reverse for a pulsing feel
                  ease: "easeInOut",
                }}
                className="w-7 h-7"
              />
            </motion.button>

            <motion.button
              onClick={() => {
                setOpenBuyModal(false);
                setOpenBuyModal2(false);
                navigator.vibrate(100);
                router.back();
              }}
              variants={buttonItem}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-400 to-[#2A75BC] hover:from-[#2A75BC] hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform"
            >
              <span className="text-xl tracking-wide font-bold">QUIT GAME</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
