import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type GameButtonProps = HTMLMotionProps<"button"> & {
  text?: string;
  loading?: boolean;
};

export const GameButton: React.FC<GameButtonProps> = ({
  text,
  loading = false,
  className = "",
  ...props
}) => {
  return (
    <motion.button
      className={`relative h-14 w-full rounded-[33px] ${className}`}
      {...props}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shadow layer */}
      <div className="absolute inset-x-0 top-1 h-14 rounded-[33px] bg-[#C2CDD5]" />

      {/* Main button */}
      <div className="relative h-14 w-full rounded-[33px] bg-primary-600 outline-2 outline-white">
        <div className="absolute inset-0 h-13 rounded-[33px] bg-primary-700 z-[1]" />
      </div>

      {/* Text */}
      <p className="absolute inset-0 z-[2] flex items-center justify-center text-white font-bold gap-1">
        <img src="/icons/consoleGame.svg" className="w-6 h-6" alt="Quiz Money Game Zone" />
        {loading ? (
          <div className="w-6 h-6 border-2 border-t-primary-800 border-gray-300 rounded-full animate-spin"></div>
        ) : (
          text
        )}
      </p>
    </motion.button>
  );
};
