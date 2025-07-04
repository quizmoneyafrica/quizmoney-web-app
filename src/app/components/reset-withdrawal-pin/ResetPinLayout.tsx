"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { motion } from "framer-motion";
import WalletApi from "@/app/api/wallet";
import { setWalletLoading, setWallet } from "@/app/store/walletSlice";
import { store } from "@/app/store/store";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";

interface PinForm {
  pin: string[];
  confirmPin: string[];
}

export default function ResetPinLayout() {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PinForm>({
    mode: "onChange",
    defaultValues: {
      pin: ["", "", "", ""],
      confirmPin: ["", "", "", ""],
    },
  });

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pin = watch("pin");
  const confirmPin = watch("confirmPin");
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const route = useRouter();
  const handlePinChange = (
    index: number,
    value: string,
    field: "pin" | "confirmPin"
  ) => {
    if (!/^\d*$/.test(value)) return;
    const current = field === "pin" ? [...pin] : [...confirmPin];
    current[index] = value.slice(-1);
    setValue(field, current, { shouldValidate: true });
    if (value && index < 3) {
      (field === "pin" ? pinRefs : confirmPinRefs).current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "pin" | "confirmPin"
  ) => {
    const current = field === "pin" ? pin : confirmPin;
    if (e.key === "Backspace" && !current[index] && index > 0) {
      (field === "pin" ? pinRefs : confirmPinRefs).current[index - 1]?.focus();
    }
  };

  const isPinComplete = pin.every((digit) => digit.length === 1);
  const isConfirmPinComplete = confirmPin.every((digit) => digit.length === 1);

  const onSubmit = async (data: PinForm) => {
    if (data.pin.join("") !== data.confirmPin.join("")) {
      alert("Pins do not match");
      return;
    }

    setIsCreatingPin(true);
    store.dispatch(setWalletLoading(true));

    try {
      const response = await WalletApi.createWithdrawalPin({
        pin: data.pin.join(""),
      });
      if (response?.updatedWallet) {
        localStorage.removeItem("wallet-reset-email");
        toast.success(response?.message, {
          position: toastPosition,
        });

        const res = await WalletApi.fetchCustomerWallet();
        if (res.data.result.wallet) {
          store.dispatch(setWallet(res.data.result.wallet));
        }
        route.replace("/wallet");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.message}`, {
        position: toastPosition,
      });
    } finally {
      setIsCreatingPin(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full  p-8 md:min-h-[60dvh] md:p-14"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1 pb-8">
            <span className="text-3xl font-bold text-neutral-800">
              Set New pin
            </span>
            <p className="text-base text-neutral-700 mt-2">
              Enter your new withdrawal pin
            </p>
          </div>

          <div className="mb-8">
            <span className="font-semibold text-lg text-black">
              Enter New Pin
            </span>
            <div className="flex md:gap-20 gap-5 mt-4 mb-8">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    pinRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={pin[idx] || ""}
                  onChange={(e) => handlePinChange(idx, e.target.value, "pin")}
                  onKeyDown={(e) => handlePinKeyDown(idx, e, "pin")}
                  className={classNames(
                    " w-8 h-8 md:w-14 md:h-14 border-1 rounded-lg text-3xl text-center focus:outline-none transition-all",
                    pin[idx] ? "border-[#2A75BC]" : "border-[#2A75BC]"
                  )}
                  autoComplete="off"
                  name={`pin[${idx}]`}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <span className="font-semibold text-lg text-black">
              Confirm New Pin
            </span>
            <div className="flex md:gap-20 gap-5 mt-4 mb-8">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    confirmPinRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={confirmPin[idx] || ""}
                  onChange={(e) =>
                    handlePinChange(idx, e.target.value, "confirmPin")
                  }
                  onKeyDown={(e) => handlePinKeyDown(idx, e, "confirmPin")}
                  className={classNames(
                    "  w-8 h-8 md:w-14 md:h-14 border-1 rounded-lg text-3xl text-center focus:outline-none transition-all",
                    confirmPin[idx] ? "border-[#2A75BC]" : "border-[#2A75BC]"
                  )}
                  autoComplete="off"
                  name={`confirmPin[${idx}]`}
                />
              ))}
            </div>
          </div>

          {errors.pin && (
            <div className="text-red-500 text-sm mb-4">
              {errors.pin.message as string}
            </div>
          )}
          {errors.confirmPin && (
            <div className="text-red-500 text-sm mb-4">
              {errors.confirmPin.message as string}
            </div>
          )}

          <CustomButton
            type="submit"
            className=" w-full max-w-4xl mt-8"
            disabled={!(isPinComplete && isConfirmPinComplete) || isCreatingPin}
            loader={isCreatingPin}
          >
            Save Pin
          </CustomButton>
        </form>
      </motion.div>
    </div>
  );
}
