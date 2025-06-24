"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { motion } from "framer-motion";

const otpSchema = z.object({
  otp: z
    .array(z.string().regex(/^\d$/, { message: "Each digit must be a number" }))
    .length(6, { message: "OTP must be 6 digits" }),
});

export default function VerifyOtpLayout() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<{ otp: string[] }>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: ["", "", "", "", "", ""] },
  });

  const [timer, setTimer] = useState(82); // 1:22 in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otp = watch("otp");

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setValue("otp", newOtp, { shouldValidate: true });
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Timer countdown
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTimer = (t: number) => {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const onSubmit = (data: { otp: string[] }) => {
    // Replace with actual OTP verification logic
    alert(data.otp.join(""));
    console.log("Verifying OTP:", data.otp.join(""));
  };

  const isOtpComplete = otp?.every((digit) => digit.length === 1);

  return (
    <div className="flex justify-center items-center pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full  p-8 md:min-h-[60dvh] md:p-14"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex-col flex gap-1 pb-8">
            <span className="text-2xl font-bold">Reset pin</span>
            <p className="text-sm text-neutral-700">
              Please enter the 6-digit code sent to your email
              <span className="text-primary-700 underline ml-2 cursor-pointer">
                sampleemail@gmail.com
              </span>{" "}
              for verification.
            </p>
          </div>
          <div className="mb-5">
            <span className="font-semibold text-lg text-black">
              Enter OTP Code
            </span>
          </div>
          <div className="flex md:gap-10 mb-8 max-w-4xl ">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[idx] || ""}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={classNames(
                  "w-14 h-14 border-1 rounded-lg text-3xl text-center focus:outline-none focus:border-primary-700 transition-all",
                  otp[idx] ? "border-primary-700" : "border-[#2A75BC]"
                )}
                autoComplete="one-time-code"
                name={`otp[${idx}]`}
              />
            ))}
          </div>
          {errors.otp && (
            <div className="text-red-500 text-sm mb-4">
              {errors.otp.message}
            </div>
          )}
          <div className="mb-12 text-sm flex items-center gap-2">
            <span>Didn&apos;t get code?</span>
            <button
              className="text-primary-700 underline font-medium disabled:opacity-50"
              disabled={timer > 0}
              type="button"
              onClick={() => setTimer(82)}
            >
              Resend Code
            </button>
            <span className="font-bold">• {formatTimer(timer)}</span>
          </div>
          <motion.button
            type="submit"
            className="w-4xl cursor-pointer bg-[#17478B] hover:bg-[#133a6e] text-white text-lg font-semibold py-4 rounded-full mt-8 transition-colors duration-200"
            whileTap={{
              scale: 0.9,
              transition: { type: "spring", stiffness: 500, damping: 15 },
            }}
            disabled={!isOtpComplete}
          >
            Verify OTP
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
