'use client";';
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";
import { useParams } from "next/navigation";
import classNames from "classnames";

interface SuccessfulActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  buttonText?: string;
  onProceed?: () => void;
}

export function SuccessfulDepositModal({
  open,
  onOpenChange,
  title = "Successful !",
  message = "You have successfully made a deposit",
}: SuccessfulActionModalProps) {
  const { success } = useParams();
  const isSuccess = Boolean(success);
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { y: "50%", opacity: 0, scale: 0.95 },
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
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 w-[90vw] max-w-[550px] shadow-lg flex flex-col items-center"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <span
                  className={classNames(
                    "flex  rounded-full p-6 items-center justify-center mb-6",
                    isSuccess ? "bg-blue-100" : " bg-red-500/15"
                  )}
                >
                  <span
                    className={classNames(
                      " rounded-full p-4",
                      isSuccess ? " bg-primary-900" : " bg-red-500"
                    )}
                  >
                    <CheckIcon className="size-7 text-white" />
                  </span>
                </span>
                <h2
                  className={classNames(
                    "text-xl font-semibold mb-2 text-center",
                    isSuccess ? " text-black" : " text-red-500"
                  )}
                >
                  {title}
                </h2>
                <p className="text-gray-600 text-center mb-8">{message}</p>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
