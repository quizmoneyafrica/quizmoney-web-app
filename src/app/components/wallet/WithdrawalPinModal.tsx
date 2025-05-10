import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "@/app/utils/CustomBtn";

interface OtpVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (pin: string) => void;
  withdrawalAmount?: number;
  bankName?: string;
  isError?: boolean;
  errorMessage?: string;
}

export default function OtpVerificationModal({
  open,
  onOpenChange,
  onVerify,
  withdrawalAmount,
  bankName,
  isError = false,
  errorMessage = "Invalid OTP code. Please try again.",
}: OtpVerificationModalProps) {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (open) {
      setOtpValues(["", "", "", ""]);
      setTimeout(() => {
        if (inputRefs.current?.[0]) {
          inputRefs.current[0]?.focus();
        }
      }, 100);
    }
  }, [open]);

  // Clear error state when user starts typing again
  useEffect(() => {
    if (isError && otpValues.some((val) => val !== "")) {
      // You can add a callback here to clear the error state
    }
  }, [otpValues, isError]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(0, 1);
    setOtpValues(newOtpValues);

    if (
      value &&
      index < otpValues.length - 1 &&
      inputRefs.current?.[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0 && inputRefs.current?.[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current?.[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otpValues.length - 1) {
      inputRefs.current?.[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const pin = otpValues.join("");
    if (pin.length === 4) {
      onVerify(pin);
    }
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
                <div className="flex justify-between items-center mb-2">
                  <Dialog.Title className="text-2xl font-semibold">
                    Create withdrawal pin
                  </Dialog.Title>
                  <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                    <Cross2Icon className="w-6 h-6" />
                  </Dialog.Close>
                </div>

                <p className="text-gray-600 mb-6">
                  Withdraw your money directly to your Bank account
                </p>

                <div className="space-y-6">
                  <div className="flex flex-col items-center pt-4 pb-8">
                    <h2 className="text-2xl font-medium mb-8">
                      Enter OTP Code
                    </h2>

                    <div className="flex justify-center space-x-4 w-full relative">
                      {otpValues.map((digit, index) => (
                        <div key={index} className="relative">
                          <input
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={digit}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={` size-14 text-center text-4xl border ${
                              isError ? "border-red-500" : "border-gray-300"
                            } rounded-lg focus:outline-none focus:${
                              isError ? "border-red-500" : "border-primary-900"
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {isError && (
                      <div className="w-full text-center mt-4 text-red-500">
                        {errorMessage}
                      </div>
                    )}
                  </div>

                  <CustomButton
                    type="button"
                    onClick={handleSubmit}
                    className="bg-[#2364AA] text-white w-full rounded-full py-3 hover:bg-primary-500"
                    disabled={otpValues.some((val) => !val)}
                  >
                    Proceed
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
