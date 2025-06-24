"use client";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { motion } from "framer-motion";

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

  const handlePinChange = (
    index: number,
    value: string,
    field: "pin" | "confirmPin"
  ) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
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

  const onSubmit = (data: PinForm) => {
    // Replace with actual PIN save logic
    if (data.pin.join("") !== data.confirmPin.join("")) {
      alert("Pins do not match");
      return;
    }
    alert("Pin set: " + data.pin.join(""));
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
                    "w-14 h-14 border-1 rounded-lg text-3xl text-center focus:outline-none transition-all",
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
                    "w-14 h-14 border-1 rounded-lg text-3xl text-center focus:outline-none transition-all",
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

          <motion.button
            type="submit"
            className="w-full max-w-4xl cursor-pointer bg-[#17478B] hover:bg-[#133a6e] text-white text-lg font-semibold py-4 rounded-full mt-8 transition-colors duration-200"
            whileTap={{
              scale: 0.97,
              transition: { type: "spring", stiffness: 500, damping: 15 },
            }}
            disabled={!(isPinComplete && isConfirmPinComplete)}
          >
            Save Pin
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
