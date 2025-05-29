import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  setWalletLoading,
  setWithdrawalModal,
  setWithdrawalPinModal,
  useWallet,
  setWallet,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import { store } from "@/app/store/store";
// import classNames from "classnames";
import CustomButton from "@/app/utils/CustomBtn";

interface OtpVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalAmount?: number;
  bankName?: string;
  isError?: boolean;
  errorMessage?: string;
}

export default function OtpVerificationModal({
  open,
  onOpenChange,
  isError = false,
  errorMessage = "Invalid OTP code. Please try again.",
}: OtpVerificationModalProps) {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { wallet, withdrawalData } = useSelector(useWallet);
  const hasPin = Boolean(wallet?.pin);

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
  // console.log("========wallet data============================");
  // console.log(JSON.stringify(wallet, null, 2));
  // console.log("==========wallet data==========================");
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

  const [isCreatingPin, setIsCreatingPin] = useState<boolean>(false);
  const [isCreatingRequest, setIsCreatingRequest] = useState<boolean>(false);

  const createPin = async (pin: string) => {
    setIsCreatingPin(true);

    try {
      const response = await WalletApi.createWithdrawalPin({
        pin,
      });
      if (response?.data?.data?.result?.updatedWallet) {
        toast.success(response?.data?.data?.result?.message, {
          position: toastPosition,
        });
        
        // Fetch and update wallet data
        store.dispatch(setWalletLoading(true));
        const res = await WalletApi.fetchCustomerWallet();
        if (res.data.result.wallet) {
          store.dispatch(setWallet(res.data.result.wallet));
        }

        store.dispatch(setWithdrawalPinModal(false));
        store.dispatch(setWithdrawalModal(true));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsCreatingPin(false);
      store.dispatch(setWalletLoading(false));
    }
  };
  const handleWithdrawal = async (pin: string) => {
    setIsCreatingRequest(true);
    if (!withdrawalData) {
      return;
    }
    try {
      const response = await WalletApi.requestWithdrawal({
        amount: withdrawalData?.amount.toString(),
        pin,
        bankAccount: withdrawalData?.bankAccount,
      });
      console.log(
        "==========createWithdrawal Request=========================="
      );
      console.log(JSON.stringify(response.data, null, 2));
      console.log(
        "==========createWithdrawal Request=========================="
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const handleSubmit = () => {
    const pin = otpValues.join("");
    if (pin.length === 4) {
      if (wallet?.pin) {
        handleWithdrawal(pin);
      } else {
        createPin(pin);
      }
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
                    {hasPin ? "Enter withdrawal pin" : "Create withdrawal pin"}
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
                  {isCreatingPin ||
                    (isCreatingRequest ? (
                      <CustomButton loader disabled width="full" />
                    ) : (
                      <CustomButton
                        loader={isCreatingPin || isCreatingRequest}
                        type="button"
                        onClick={handleSubmit}
                        width="full"
                        disabled={
                          otpValues.some((val) => !val) ||
                          isCreatingPin ||
                          isCreatingRequest
                        }
                      >
                        {"Proceed"}
                      </CustomButton>
                    ))}
                  {/* <button
                    type="button"
                    onClick={handleSubmit}
                    className={classNames(
                      " text-white w-full rounded-full py-3 hover:bg-primary-500",
                      otpValues.some((val) => !val) ||
                        isCreatingPin ||
                        isCreatingRequest
                        ? " bg-primary-900/30"
                        : "bg-[#2364AA]"
                    )}
                    disabled={
                      otpValues.some((val) => !val) ||
                      isCreatingPin ||
                      isCreatingRequest
                    }
                  >
                    {isCreatingPin || isCreatingRequest ? (
                      <div className=" border-b border-b-white animate-spin size-5" />
                    ) : (
                      "Proceed"
                    )}
                  </button> */}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
