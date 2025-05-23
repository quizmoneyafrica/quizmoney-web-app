"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

interface ResponsiveDialogProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export default function ResponsiveDialog({
  trigger,
  children,
  title,
  description,
  open,
  onOpenChange,
  className,
}: ResponsiveDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const modalVariants = {
    hidden: {
      y: "50%",
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      y: "30%",
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <>
            {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

            <Dialog.Portal>
              {/* Overlay/Backdrop */}
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/50"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={overlayVariants}
                />
              </Dialog.Overlay>
              {/* Content - Modal for desktop, Bottom sheet for mobile */}

              <Dialog.Content>
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`
                    fixed z-50 bg-white min-h-[400px] outline-none
                    data-[state=open]:animate-in data-[state=closed]:animate-out duration-200 
        
                    ${
                      isMobile
                        ? "inset-x-0 bottom-0 rounded-t-lg w-full max-w-full data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
                        : "top-1/2 left-1/2 min-w-[700px]  -translate-x-1/2 -translate-y-1/2 rounded-lg data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 max-w-lg w-full shadow-lg"
                    }
                    ${className}
                  `}
                >
                  {/* Header Area */}
                  {(title || description) && (
                    <div className="p-6 pb-2">
                      {title && (
                        <Dialog.Title className="text-lg font-medium text-gray-900 ">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-gray-500 ">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                  )}

                  {/* Content Area */}
                  <div
                    className={`p-6 pt-0 ${
                      isMobile ? "max-h-[75vh] overflow-y-auto" : ""
                    }`}
                  >
                    {children}
                  </div>
                  {/* Close Button */}
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
