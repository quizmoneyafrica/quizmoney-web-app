/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/app/utils/CustomBtn";
import OTPVerification from "./OTPVerification";
import KycAPI from "@/app/api/kycApi";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import Modal from "@/app/components/game/modal/ModalWindow";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import {
  setOpenModal,
  setShowOtpVerification,
  UserObject,
} from "@/app/store/authSlice";
import { getAuthUser } from "@/app/api/userApi";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Enter a valid phone number")
    .refine((val) => val && val.startsWith("+"), {
      message: "Phone number must start with + and country code",
    }),
});

type PhoneForm = z.infer<typeof phoneSchema>;

export default function PhoneVerification({ onNext }: { onNext: () => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const { phone } = getAuthUser() as UserObject;

  useEffect(() => {
    if (phone) {
      setPhoneNumber(phone);
    }
  }, [phone]);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const phoneNumberLocal = localStorage.getItem("phoneNumber");

  const openModal = useAppSelector((s) => s.auth.openModal) ?? false;
  const showOtpVerification =
    useAppSelector((s) => s.auth.showOtpVerification) ?? false;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  const verifyPhone = async () => {
    setIsLoading(true);
    try {
      const res = await KycAPI.phoneVerify(phoneNumber || phoneNumberLocal!);
      if (res.success) {
        toast.success("Phone verification initiated", {
          position: toastPosition,
        });
        dispatch(setShowOtpVerification(true));
        dispatch(setOpenModal(false));
      } else {
        toast.error(res.message || "Failed to initiate phone verification", {
          position: toastPosition,
        });
      }
    } catch (error: any) {
      toast.error(error.message, { position: toastPosition });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PhoneForm) => {
    localStorage.setItem(
      "phoneNumber",
      data.phoneNumber.split(" ").join("").trim()
    );
    setPhoneNumber(data.phoneNumber.split(" ").join("").trim());
    dispatch(setOpenModal(true));
  };

  if (showOtpVerification) {
    return (
      <OTPVerification
        onNext={onNext}
        onBack={() => dispatch(setShowOtpVerification(false))}
        phoneNumber={phoneNumber || phoneNumberLocal!}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <div className=" w-full mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Phone Number
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We&apos;ll send you a 6-digit OTP to confirm your number.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Enter Phone Number
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  countrySelectProps={{
                    style: {
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                  {...field}
                  placeholder="Enter phone number"
                  defaultCountry="NG"
                  countries={["NG"]}
                  addInternationalOption={false}
                  countryCallingCodeEditable={false}
                  international
                  className="phone-input"
                  style={
                    {
                      "--PhoneInputCountryFlag-height": "1.5em",
                      "--PhoneInput-color--focus": "#3A3A3A80",
                    } as React.CSSProperties
                  }
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-2">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className=" pt-4 w-full">
            <CustomButton
              disabled={isSubmitting}
              className=" rounded w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Verify {control._defaultValues.phoneNumber}
            </CustomButton>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By clicking verify, you agree to receive SMS messages.
              <br />
              Message and data rates may apply.
            </p>
          </div>
        </form>
      </div>

      <Modal
        open={openModal}
        handleClose={(open: boolean) => dispatch(setOpenModal(open))}
        title="Confirm Phone Number"
        actionBtnText="Yes, Proceed"
        showCloseIcon={false}
        actionOnClick={verifyPhone}
        redTitle
        actionLoader={isLoading}
      >
        <div>
          <p>
            Confirm <span className="font-bold">{phoneNumber}</span> is correct.
            You&apos;ll be charged ₦100 per verification.
          </p>
        </div>
      </Modal>
    </div>
  );
}
