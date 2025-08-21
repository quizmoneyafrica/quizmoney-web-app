import CustomButton from "@/app/utils/CustomBtn";
import React, { useRef, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/app/utils/utils";
import { ArrowLeft, Loader } from "lucide-react";
import QmDrawer from "@/app/components/drawer/drawer";
import CustomImage from "@/app/components/wallet/CustomImage";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

type OTPForm = z.infer<typeof otpSchema>;

export default function OTPVerification({
  phoneNumber = "+2349012345678",
  onBack,
  onNext,
}: {
  phoneNumber?: string;
  onVerify?: (otp: string) => void;
  onBack: () => void;
  onNext: () => void;
  onResendCode?: () => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = React.useState(82);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Split OTP string into array for display
  const otpValue = getValues("otp");
  const otpDigits = Array.from({ length: 6 }, (_, i) => otpValue[i] || "");

  // Handle input change for each digit
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    let newOtp = otpDigits.slice();
    newOtp[index] = value;
    // Only keep digits
    newOtp = newOtp.map((d) => (/\d/.test(d) ? d : ""));
    setValue("otp", newOtp.join(""));
    trigger("otp");
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const digits = pastedData.slice(0, 6).split("");
    let newOtp = otpDigits.slice();
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setValue("otp", newOtp.join(""));
    trigger("otp");
    // Focus next empty input or last one
    const nextEmptyIndex = newOtp.findIndex((digit, idx) => !digit && idx < 6);
    const focusIndex =
      nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const [successModal, setSuccessModal] = React.useState(false);

  // Submit handler
  const onSubmit = (data: OTPForm) => {
    setSuccessModal(true);
  };

  // Resend handler
  const handleResend = () => {
    reset();
    inputRefs.current[0]?.focus();

    // resend code
  };

  // Mask phone number: show country code and last 4 digits, mask the rest
  const maskPhoneNumber = (num: string) => {
    if (!num) return "";
    // Find country code (assume starts with '+')
    const match = num.match(/^(\+\d{1,3})(\d{0,})$/);
    if (!match) return num;
    const country = match[1];
    const rest = match[2];
    if (rest.length < 4) return num;
    const masked =
      rest.slice(0, rest.length - 4).replace(/\d/g, "*") + rest.slice(-4);
    return `${country}${masked}`;
  };

  return (
    <Fragment>
      <div className="w-full flex-1">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 md:items-center">
          <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-black text-sm">
            We sent a 6-digit code to {maskPhoneNumber(phoneNumber)}.
          </p>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 w-full flex flex-col gap-2 md:items-center ">
            <label className=" text-sm font-semibold text-black">
              Enter OTP Code
            </label>
            <div className="flex flex-1 gap-3 md:justify-center justify-between w-full">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                    if (index === 0) {
                      const { ref } = register("otp");
                      if (typeof ref === "function") {
                        ref(el);
                      } else if (ref) {
                        (
                          ref as React.MutableRefObject<HTMLInputElement | null>
                        ).current = el;
                      }
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={cn(
                    "aspect-square w-10 h-10 md:w-12 md:h-12 text-center text-lg font-semibold border-1 rounded focus:border-primary-900 focus:outline-none transition-colors",
                    errors.otp ? "border-red-500" : "border-primary-900"
                  )}
                  // Remove {...(index === 0 ? register("otp") : {})}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <div className="pt-4 w-full flex justify-between gap-2">
            <CustomButton
              type="button"
              onClick={() => {
                setSuccessModal(false);
                onBack?.();
              }}
              className=" flex border border-primary-900 bg-white hover:bg-white  items-center w-fit gap-2 flex-1 h-12"
            >
              <ArrowLeft className="text-primary-900" />
              <span className="text-primary-900">Back</span>
            </CustomButton>
            <CustomButton
              loaderComponent={
                <Loader className="animate-spin size-5 text-white" />
              }
              type="submit"
              disabled={otpValue.length !== 6 || !!errors.otp}
              className="w-full h-12 flex items-center justify-center  py-4 rounded-full text-white font-semibold text-lg transition-all"
            >
              Verify
            </CustomButton>
          </div>
        </form>

        {/* Resend Code */}
        <div className="md:text-center text-start mt-6">
          <p className="text-sm text-black">
            Didn't get code?{" "}
            {timeLeft > 0 ? (
              <span className="text-gray-500">
                Resend Code • {formatTime(timeLeft)}
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary-900 hover:text-primary-900 font-medium"
                type="button"
              >
                Resend Code
              </button>
            )}
          </p>
        </div>
      </div>

      <QmDrawer
        open={successModal}
        onOpenChange={() => {}}
        title=""
        titleLeft
        heightClass="h-[75%] md:h-[45%] lg:h-[65%]"
      >
        {/* Provide valid children here */}
        <div className=" flex-col flex gap-2 items-center pt-2">
          <CustomImage alt="succ" src={"/icons/success_bg.svg"} />
          <p className="font-bold text-xl text-[#3B3B3B] text-center">
            Phone number verified <br /> Successfully
          </p>
          <div className=" w-full pt-14">
            <CustomButton
              onClick={() => {
                setSuccessModal(false);
                onNext();
              }}
              loaderComponent={
                <Loader className="animate-spin size-5 text-white" />
              }
              type="submit"
              disabled={otpValue.length !== 6 || !!errors.otp}
              className="w-full h-12 flex items-center justify-center  py-4 rounded-full text-white font-semibold text-lg transition-all"
            >
              Proceed to step 2 Verification
            </CustomButton>
          </div>
        </div>
      </QmDrawer>
    </Fragment>
  );
}
