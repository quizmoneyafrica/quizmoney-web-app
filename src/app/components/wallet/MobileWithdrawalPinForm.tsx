import { useState } from "react";
import CustomButton from "@/app/utils/CustomBtn";
import classNames from "classnames";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema for PIN validation with Zod
const pinFormSchema = z.object({
  pin: z
    .string()
    .length(4, { message: "PIN must be exactly 4 digits" })
    .regex(/^\d{4}$/, { message: "PIN must contain only numbers" }),
});

type PinFormData = z.infer<typeof pinFormSchema>;

export const WithdrawalPinForm = ({
  onSubmit,
  close,
  maxAttempts = 3,
}: {
  onSubmit: (pin: string) => void;
  close?: () => void;
  maxAttempts?: number;
}) => {
  const [pinValues, setPinValues] = useState(["", "", "", ""]);
  const [attemptsLeft, setAttemptsLeft] = useState(maxAttempts);
  const [invalidPinError, setInvalidPinError] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
  } = useForm<PinFormData>({
    resolver: zodResolver(pinFormSchema),
    mode: "onChange",
  });

  // Handle input change for each digit
  const handlePinChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    const newPin = [...pinValues];
    // Take only the last character if pasting multiple digits
    newPin[index] = value.slice(-1);
    setPinValues(newPin);

    // Update form value
    const pinString = newPin.join("");
    setValue("pin", pinString);

    // Clear errors when typing
    if (errors.pin) {
      clearErrors("pin");
    }

    // Clear invalid PIN error when typing
    if (invalidPinError) {
      setInvalidPinError(false);
    }

    // Auto focus next input if value is entered and not the last input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }

    // Validate if all digits are filled
    if (pinString.length === 4) {
      trigger("pin");
    }
  };

  // This simulates PIN verification - in a real app,
  // you would verify against your backend
  const verifyPin = (pin: string): boolean => {
    // For demo purposes - replace with actual verification logic
    // Example: return await api.verifyPin(pin);
    return pin !== "1358"; // For demo: 1358 is considered invalid
  };

  // Handle form submission
  const onFormSubmit = (data: PinFormData) => {
    // Verify PIN
    const isValid = verifyPin(data.pin);

    if (isValid) {
      onSubmit(data.pin);

      // Reset form after successful submission
      setPinValues(["", "", "", ""]);
      setValue("pin", "");
      setAttemptsLeft(maxAttempts);
      setInvalidPinError(false);
      close?.();
    } else {
      // Handle invalid PIN
      setInvalidPinError(true);
      setAttemptsLeft((prevAttempts) => prevAttempts - 1);

      // Handle account lockout if no attempts left
      if (attemptsLeft <= 1) {
        // You might want to lock the account or show a different screen
        alert("Account locked. Please contact support.");
        close?.();
      }
    }
  };

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move focus to previous input when backspace is pressed on an empty input
    if (e.key === "Backspace" && !pinValues[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="bg-white rounded-3xl h-full flex flex-col items-center">
      {!invalidPinError && (
        <p className="text-gray-600 mb-8">
          Withdraw your money directly to your Bank account
        </p>
      )}

      <div className="w-full">
        {!invalidPinError && (
          <h2 className="text-xl text-center mb-6">Enter 4 digit pin</h2>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="flex justify-center gap-4 mb-4">
            <div
              className={`w-fit border rounded-xl ${
                invalidPinError || errors.pin
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`pin-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinValues[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={classNames(
                    "w-12 h-12 text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:rounded-xl",
                    invalidPinError ? "text-red-500 font-bold" : "",
                    index == 0
                      ? `border-r ${
                          invalidPinError || errors.pin
                            ? "border-r-red-500"
                            : "border-r-gray-300"
                        }`
                      : index == 1
                      ? `border-r ${
                          invalidPinError || errors.pin
                            ? "border-r-red-500"
                            : "border-r-gray-300"
                        }`
                      : index == 2
                      ? `border-r ${
                          invalidPinError || errors.pin
                            ? "border-r-red-500"
                            : "border-r-gray-300"
                        }`
                      : ""
                  )}
                />
              ))}
            </div>
          </div>

          {errors.pin && !invalidPinError && (
            <p className="text-red-500 text-center mb-4">
              {errors.pin.message}
            </p>
          )}

          {invalidPinError && (
            <div className="text-center">
              <p className="text-red-500 text-center">
                Incorrect pin provided.
              </p>
              <p className="text-red-500 text-center">
                {attemptsLeft} attemps left
              </p>
            </div>
          )}

          <div className="mt-16">
            <CustomButton
              type="submit"
              className="bg-primary-900 text-white w-full rounded-full py-4 hover:bg-primary-700"
              disabled={invalidPinError && attemptsLeft <= 0}
            >
              Proceed
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalPinForm;
