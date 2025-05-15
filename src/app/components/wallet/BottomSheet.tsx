"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/app/utils/utils";

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  full = false,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  full?: boolean;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden fixed z-[100] inset-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-white  shadow-lg p-5 pb-8 flex flex-col  overflow-y-auto",
              full ? "max-h-[100vh]" : "max-h-[90vh] rounded-t-3xl"
            )}
          >
            {!full && (
              <div
                onClick={onClose}
                className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6"
              />
            )}

            {title && (
              <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
