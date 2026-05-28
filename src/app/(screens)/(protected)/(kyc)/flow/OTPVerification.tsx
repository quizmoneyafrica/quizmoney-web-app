"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import CustomButton from "@/app/utils/CustomBtn";
import { useVerifyPhoneOtp, useVerificationStatus } from "@/lib/queries";
import { toastPosition } from "@/app/utils/utils";
import CustomImage from "@/app/components/wallet/CustomImage";
import QmDrawer from "@/app/components/drawer/drawer";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

type OTPForm = z.infer<typeof otpSchema>;

export default function OTPVerification({
  phoneNumber = "",
  onBack,
  onNext,
}: {
  phoneNumber: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(82);
  const [successModal, setSuccessModal] = useState(false);

  const verifyPhoneOtp = useVerifyPhoneOtp();
  const { refetch: refreshVerification } = useVerificationStatus();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const otpValue = watch("otp");
  const otpDigits = Array.from({ length: 6 }, (_, i) => otpValue[i] || "");

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const digit = value.replace(/\D/g, "");
    const newOtp = otpDigits.slice();
    newOtp[index] = digit;
    setValue("otp", newOtp.join(""), { shouldValidate: true });

    // Auto-advance to next box when a digit is entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        // Clear current box
        const newOtp = otpDigits.slice();
        newOtp[index] = "";
        setValue("otp", newOtp.join(""), { shouldValidate: true });
      } else if (index > 0) {
        // Move back and clear previous box
        const newOtp = otpDigits.slice();
        newOtp[index - 1] = "";
        setValue("otp", newOtp.join(""), { shouldValidate: true });
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setValue("otp", pasted, { shouldValidate: true });
    // Focus the last filled box after paste
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const onSubmit = async (data: OTPForm) => {
    try {
      await verifyPhoneOtp.mutateAsync({
        otp: data.otp,
        phone_number: phoneNumber,
      });

      await refreshVerification(); // Refresh KYC status
      setSuccessModal(true);
    } catch (err: any) {
      // Error handled in query mutation
    }
  };

  const handleResend = () => {
    reset();
    inputRefs.current[0]?.focus();
    setTimeLeft(82);
    // You can call resend OTP here if needed
  };

  const maskPhoneNumber = (num: string) => {
    if (!num) return "";
    return num.replace(/(\+\d{3})\d{4}(\d{4})/, "$1****$2");
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
        <p className="text-gray-600 text-sm mt-1">
          We sent a 6-digit code to{" "}
          <strong>{maskPhoneNumber(phoneNumber)}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <label className="text-sm font-semibold block mb-3">
            Enter OTP Code
          </label>
          <div className="flex gap-3 justify-center">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:border-primary-900 focus:outline-none"
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-red-500 text-xs mt-2 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <CustomButton
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1 text-neutral-500 border-neutral-300"
          >
            Back
          </CustomButton>

          <CustomButton
            type="submit"
            loader={verifyPhoneOtp.isPending}
            disabled={otpValue.length !== 6 || verifyPhoneOtp.isPending}
            className="flex-1"
          >
            Verify OTP
          </CustomButton>
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm">
          Didn&apos;t receive code?{" "}
          {timeLeft > 0 ? (
            <span>Resend in {formatTime(timeLeft)}</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary-900 font-medium"
            >
              Resend Code
            </button>
          )}
        </p>
      </div>

      {/* Success Drawer */}
      <QmDrawer
        open={successModal}
        onOpenChange={onNext}
        title=""
        heightClass="h-[65%]"
      >
        <div className="flex flex-col items-center pt-8 text-center">
          <CustomImage alt="success" src="/icons/success_bg.svg" />
          <h2 className="text-2xl font-bold mt-6">Phone Verified!</h2>
          <p className="text-gray-600 mt-2">
            Your number has been successfully verified.
          </p>

          <CustomButton onClick={onNext} className="mt-12 w-full">
            Continue to BVN Verification
          </CustomButton>
        </div>
      </QmDrawer>
    </div>
  );
}
