import { useState } from "react";
import CustomButton from "@/app/utils/CustomBtn";
import classNames from "classnames";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WalletApi from "@/app/api/wallet";
import { store } from "@/app/store/store";
import {
  setWalletLoading,
  setWallet,
  setWithdrawalPinModal,
  setWithdrawalModal,
  useWallet,
} from "@/app/store/walletSlice";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import Link from "next/link";

// Define schema for PIN validation with Zod
const pinFormSchema = z.object({
  pin: z
    .string()
    .length(4, { message: "PIN must be exactly 4 digits" })
    .regex(/^\d{4}$/, { message: "PIN must contain only numbers" }),
});

type PinFormData = z.infer<typeof pinFormSchema>;

export const WithdrawalPinForm = ({
  close,
}: {
  onSubmit: (pin: string) => void;
  close?: () => void;
  maxAttempts?: number;
}) => {
  const [pinValues, setPinValues] = useState(["", "", "", ""]);
  const [invalidPinError, setInvalidPinError] = useState(false);
  const [isCreatingPin, setIsCreatingPin] = useState<boolean>(false);
  const { wallet, withdrawalData } = useSelector(useWallet);

  const [isCreatingRequest, setIsCreatingRequest] = useState<boolean>(false);
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

  const verifyPin = (pin: string): boolean => {
    return pin.length == 4;
  };

  // Handle form submission
  const onFormSubmit = (data: PinFormData) => {
    // Verify PIN
    const isValid = verifyPin(data.pin);
    if (isValid) {
      if (wallet?.pin) {
        handleWithdrawal(data.pin);
      } else {
        createPin(data.pin);
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
  const createPin = async (pin: string) => {
    setIsCreatingPin(true);

    try {
      const response = await WalletApi.createWithdrawalPin({
        pin,
      });
      if (response?.data?.data?.result?.updatedWallet) {
        toast.success(response?.data?.data?.result?.message, {
          position: toastPosition,
        });
        store.dispatch(setWalletLoading(true));
        const res = await WalletApi.fetchCustomerWallet();
        if (res.data.result.wallet) {
          store.dispatch(setWallet(res.data.result.wallet));
        }

        store.dispatch(setWithdrawalPinModal(false));
        store.dispatch(setWithdrawalModal(true));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsCreatingPin(false);
      store.dispatch(setWalletLoading(false));
    }
  };
  const handleWithdrawal = async (pin: string) => {
    console.log("====================================");
    console.log("Withdrawal pin submitted:", pin, withdrawalData);
    console.log("====================================");
    setIsCreatingRequest(true);
    if (!withdrawalData) {
      return;
    }
    try {
      const response = await WalletApi.requestWithdrawal({
        amount: withdrawalData?.amount.toString(),
        pin,
        bankAccount: withdrawalData?.bankAccount,
      });
      if (response?.data?.result) {
        toast.success(response?.data?.result.message, {
          position: toastPosition,
        });
        store.dispatch(setWithdrawalPinModal(false));
        store.dispatch(setWithdrawalModal(false));
        close?.();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsCreatingRequest(false);
    }
  };
  console.log(wallet);

  return (
    <div className="bg-white rounded-3xl h-full flex flex-col items-center">
      {!invalidPinError && (
        // <p className="text-gray-600 mb-8">
        //   Withdraw your money directly to your Bank account
        // </p>
        <p className="text-neutral-500 mb-8 -mt-3 text-xs text-left w-full">
          Input your withdrawal pin
        </p>
      )}

      <div className="w-full">
        {!invalidPinError && (
          <h2 className="text-xl text-center mb-6">
            {typeof wallet?.pin === "string"
              ? "Enter Withdrawal Pin"
              : "Create withdrawal pin"}
          </h2>
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

          <div className="mt-16">
            <CustomButton
              type="submit"
              className="bg-primary-900 text-white w-full rounded-full py-4 hover:bg-primary-700"
              disabled={invalidPinError || isCreatingPin || isCreatingRequest}
            >
              Proceed
            </CustomButton>
          </div>
        </form>

        {wallet?.pin && (
          <div className="w-full text-center pt-10">
            <p className="text-neutral-500 text-sm">
              Can&apos;t remember your pin?
            </p>
            <Link href="mailto:hi@quizmoney.ng">
              <span className="text-primary-900 underline underline-offset-1">
                Contact Us
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalPinForm;
