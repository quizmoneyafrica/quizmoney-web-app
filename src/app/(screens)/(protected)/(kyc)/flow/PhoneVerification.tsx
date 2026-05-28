"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

import CustomButton from "@/app/utils/CustomBtn";
import OTPVerification from "./OTPVerification";
import { useSendPhoneOtp, useMe } from "@/lib/queries";
// import { toastPosition } from "@/app/utils/utils";
import Modal from "@/app/components/game/modal/ModalWindow";
import QMLoader from "@/app/components/splashScreen/QMLoader";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Enter a valid phone number")
    .refine((val) => val?.startsWith("+"), {
      message: "Phone number must include country code (e.g. +234)",
    }),
});

type PhoneForm = z.infer<typeof phoneSchema>;

export default function PhoneVerification({ onNext }: { onNext: () => void }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState("");

  const { data: user, isFetching } = useMe();
  // const { data: verificationStatus } = useVerificationStatus();
  const sendPhoneOtp = useSendPhoneOtp();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  console.log("USER: ", user);

  // Pre-fill phone number from user profile (useMe)
  useEffect(() => {
    if (user?.phone_number) {
      setValue("phoneNumber", user.phone_number);
      setPendingPhoneNumber(user.phone_number);
    }
  }, [user]);

  const onSubmit = (data: PhoneForm) => {
    const cleanNumber = data.phoneNumber.trim();
    setPendingPhoneNumber(cleanNumber);
    setShowConfirmModal(true);
  };

  const handleSendOtp = async () => {
    if (!pendingPhoneNumber) return;

    try {
      await sendPhoneOtp.mutateAsync(pendingPhoneNumber);
      setShowConfirmModal(false);

      // Show OTP screen
      setShowOtpScreen(true);
      return (
        <OTPVerification
          phoneNumber={pendingPhoneNumber}
          onNext={onNext}
          onBack={() => setShowOtpScreen(false)}
        />
      );
    } catch {
      // Error already handled in the mutation
    }
  };

  if (showOtpScreen) {
    return (
      <OTPVerification
        phoneNumber={pendingPhoneNumber}
        onNext={onNext}
        onBack={() => setShowOtpScreen(false)}
      />
    );
  }

  if (isFetching) {
    return (
      <div className="w-full grid place-items-center">
        <QMLoader />
      </div>
    );
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Phone Number
        </h1>
        <p className="text-gray-600">
          We&apos;ll send a 6-digit OTP code to verify your number.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-900">
            Phone Number
          </label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                placeholder="Enter your phone number"
                defaultCountry="NG"
                countries={["NG"]}
                international
                countryCallingCodeEditable={false}
                className="phone-input"
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <CustomButton type="submit" className="w-full">
          Continue
        </CustomButton>
      </form>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        title="Confirm Phone Number"
        actionBtnText="Send OTP"
        actionOnClick={handleSendOtp}
        actionLoader={sendPhoneOtp.isPending}
      >
        <div className="py-2">
          <p>
            We will send a verification code to{" "}
            <span className="font-semibold">{pendingPhoneNumber}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Standard SMS charges may apply.
          </p>
        </div>
      </Modal>
    </div>
  );
}
