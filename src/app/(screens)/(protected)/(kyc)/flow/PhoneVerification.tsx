import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/app/utils/CustomBtn";
import OTPVerification from "./OTPVerification";

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });
  const [state, setState] = React.useState<string | undefined>();

  const onSubmit = async (data: PhoneForm) => {
    try {
      // Your verification logic here
      // API call would go here
      setState(data.phoneNumber);
      // onNext();
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  if (state) {
    return (
      <OTPVerification
        onNext={onNext}
        onBack={() => setState(undefined)}
        phoneNumber={state}
      />
    );
    // OTP has been sent
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Header */}
        <div className=" w-full mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Phone Number
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We'll send you a 6-digit OTP to confirm your number.
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
                      // Add any styles you need for the country select here
                    },
                  }}
                  {...field}
                  placeholder="Enter phone number"
                  defaultCountry="NG"
                  international
                  countryCallingCodeEditable={false}
                  className="phone-input"
                  style={{
                    "--PhoneInputCountryFlag-height": "1.5em",
                    "--PhoneInput-color--focus": "#3A3A3A80",
                  }}
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
              Verify
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
    </div>
  );
}
