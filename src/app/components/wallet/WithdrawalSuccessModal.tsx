import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "@/app/utils/CustomBtn";
import CustomImage from "./CustomImage";

interface WithdrawalSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalAmount?: string;
}

export default function WithdrawalSuccessModal({
  open,
  onOpenChange,
  withdrawalAmount = "₦10,000",
}: WithdrawalSuccessModalProps) {
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90vw] max-w-[600px] shadow-lg"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex flex-col items-center pt-4 pb-8">
                  <CustomImage
                    alt="ICON-IMAGE"
                    className=" size-7"
                    src={"/icons/success.svg"}
                  />

                  <h2 className="text-3xl font-semibold text-center mb-4">
                    Good job!
                  </h2>

                  <p className="text-gray-600 text-center mb-8">
                    {withdrawalAmount}
                    {
                      " withdrawal request is in process you will get a notification when it's approved"
                    }
                  </p>

                  <CustomButton
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="bg-[#2364AA] text-white w-full rounded-full py-3 hover:bg-primary-500"
                  >
                    Go back
                  </CustomButton>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
