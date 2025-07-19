"use client";
import React, { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { motion } from "framer-motion";
import WalletApi from "@/app/api/wallet";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";

const otpSchema = z.object({
  otp: z
    .array(z.string().regex(/^\d$/, { message: "Each digit must be a number" }))
    .length(6, { message: "OTP must be 6 digits" }),
});

export default function VerifyOtpLayout() {
  const emailD = localStorage.getItem("wallet-reset-email");

  const localEmail = useMemo(() => emailD ?? "", [emailD]);

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
  const [loading, setLoading] = useState(false); // Loading state
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
  const route = useRouter();

  const onSubmit = async (data: { otp: string[] }) => {
    if (!localEmail) {
      return;
    }
    const refined = data.otp.join("");
    // alert();
    console.log("Verifying OTP:", data.otp.join(""));
    setLoading(true);
    try {
      const response = await WalletApi.verifyPinOtp({
        otp: refined,
        email: localEmail,
      });
      if (response.data) {
        toast.success(response?.message, {
          position: toastPosition,
        });
        route.push("/wallet/reset-pin/pin");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.message}`, {
        position: toastPosition,
      });
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp?.every((digit) => digit.length === 1);
  const resendOtp = async () => {
    if (!localEmail) {
      return;
    }
    setLoading(true);
    console.log("Send OTP to:", localEmail);
    try {
      const response = await WalletApi.forgotPin({ email: localEmail });

      if (response.data) {
        toast.success(response?.message, {
          position: toastPosition,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.message}`, {
        position: toastPosition,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full p-3 flex flex-col  md:min-h-[60dvh] md:p-14"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex-col flex gap-1 pb-6 sm:pb-8">
            <span className="text-xl sm:text-2xl font-bold">Reset pin</span>
            <p className="text-xs sm:text-sm text-neutral-700">
              Please enter the 6-digit code sent to your email
              <span className="text-primary-700 underline ml-1 sm:ml-2 cursor-pointer break-all">
                {localEmail}
              </span>{" "}
              for verification.
            </p>
          </div>
          <div className="mb-4 sm:mb-5">
            <span className="font-semibold text-base sm:text-lg text-black">
              Enter OTP Code
            </span>
          </div>

          {/* Mobile: Grid layout, Desktop: Original flex layout */}
          <div className="flex gap-2 sm:gap-4 md:gap-10 mb-6 sm:mb-8 max-w-4xl overflow-x-auto">
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
                  "w-8 h-8 sm:w-14 sm:h-14 border-1 rounded-lg text-2xl sm:text-3xl text-center focus:outline-none focus:border-primary-700 transition-all flex-shrink-0",
                  otp[idx] ? "border-primary-700" : "border-[#2A75BC]"
                )}
                autoComplete="one-time-code"
                name={`otp[${idx}]`}
              />
            ))}
          </div>

          {errors.otp && (
            <div className="text-red-500 text-xs sm:text-sm mb-4">
              {errors.otp.message}
            </div>
          )}

          <div className="mb-8 sm:mb-12 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <span>Didn&apos;t get code?</span>
            <div className="flex items-center gap-2">
              <button
                className="text-primary-700 underline font-medium disabled:opacity-50"
                disabled={timer > 0}
                type="button"
                onClick={() => {
                  resendOtp();
                  setTimer(82);
                }}
              >
                Resend Code
              </button>
              <span className="font-bold">• {formatTimer(timer)}</span>
            </div>
          </div>

          <CustomButton
            type="submit"
            className=" md:max-w-2xl w-full"
            disabled={!isOtpComplete || loading}
            loader={loading}
          >
            Verify OTP
          </CustomButton>
        </form>
      </motion.div>
    </div>
  );
}
