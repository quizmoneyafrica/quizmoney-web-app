import CustomButton from "@/app/utils/CustomBtn";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthUser } from "@/app/api/userApi";
import WalletApi from "@/app/api/wallet";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import {
  setWallet,
  setWalletLoading,
  useWallet,
} from "@/app/store/walletSlice";
import { useDispatch, useSelector } from "react-redux";

// Define bank interface
export interface Bank {
  id: number;
  code: string;
  name: string;
}

type MobileAddBankAccountProps = {
  close?: () => void;
};

const bankAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(10, { message: "Account number must be at least 10 digits" })
    .max(10, { message: "Account number must be exactly 10 digits" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  bankCode: z.string().min(1, { message: "Please select a bank" }),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

export const MobileAddBankAccount = ({ close }: MobileAddBankAccountProps) => {
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    mode: "onChange",
    defaultValues: {
      accountNumber: "",
      bankCode: "",
    },
  });

  const { banks } = useSelector(useWallet) as { banks: Bank[] };
  const sortedBanks = useMemo(
    () => [...banks].sort((a, b) => a.name.localeCompare(b.name)),
    [banks]
  );

  useEffect(() => {
    if (sortedBanks.length > 0 && !watch("bankCode")) {
      setValue("bankCode", sortedBanks[0].code, { shouldValidate: true });
    }
  }, [sortedBanks, setValue, watch]);

  const selectedBankCode = watch("bankCode");

  const onSubmit = async (data: BankAccountFormData) => {
    const { email } = await getAuthUser();

    try {
      setIsVerifying(true);

      const payload = {
        email: email,
        accountNumber: data?.accountNumber,
        bankCode: `${data?.bankCode}`.trim(),
      };
      console.log("==============payload======================");
      console.log(JSON.stringify(payload, null, 2));
      console.log("====================================");
      const response = await WalletApi.verifyAccount(payload);
      if (response?.data?.result?.status === "success") {
        const { account_name, account_number } = response?.data?.result?.data;
        const bankName =
          banks.find((item) => item?.code === data?.bankCode)?.name ?? "";
        addVerifiedAccount({
          accountNumber: account_number,
          bankName,
          accountName: account_name,
        });
      }
      if (response?.data?.result?.status === "error") {
        toast.error(`${response?.data?.result?.message}`, {
          position: toastPosition,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("WalletApi.verifyAccount", err);
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const dispatch = useDispatch();

  const addVerifiedAccount = async (data: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await WalletApi.addBankAccount({
        newBankAccount: {
          ...data,
        },
      });
      if (response?.data?.result?.updatedWallet) {
        dispatch(setWalletLoading(true));
        const res = await WalletApi.fetchCustomerWallet();
        dispatch(setWallet(res.data.result.wallet));
        toast.success(response.data?.result?.message, {
          position: toastPosition,
        });
        reset();
        close?.();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected bank details
  const selectedBank = banks.find((bank) => bank.code === selectedBankCode);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-gray-600">Add your bank account for withdrawal</p>

      <div>
        <label
          htmlFor="accountNumber"
          className="block text-gray-800 font-medium mb-2"
        >
          Account Number
        </label>
        <input
          id="accountNumber"
          type="text"
          {...register("accountNumber")}
          className={`w-full border ${
            errors.accountNumber ? "border-red-500" : "border-gray-300"
          } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-invalid={!!errors.accountNumber}
          aria-describedby={
            errors.accountNumber ? "accountNumber-error" : undefined
          }
        />
        {errors.accountNumber && (
          <p id="accountNumber-error" className="text-red-500 text-sm mt-1">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bankCode"
          className="block text-gray-800 font-medium mb-2"
        >
          Select Bank
        </label>
        <div className="relative">
          <button
            id="bankCode"
            type="button"
            className={`w-full border ${
              errors.bankCode ? "border-red-500" : "border-gray-300"
            } rounded-lg p-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => setShowBankDropdown(!showBankDropdown)}
            aria-expanded={showBankDropdown}
            aria-controls="bank-dropdown"
          >
            <span>{selectedBank?.name || "Select a bank"}</span>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </button>
          {errors.bankCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bankCode.message}
            </p>
          )}
          {showBankDropdown && (
            <div
              id="bank-dropdown"
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-[35dvh] overflow-y-auto"
            >
              <div className="p-2 sticky top-0 bg-white z-10"></div>
              {sortedBanks.map((bank) => (
                <button
                  key={bank.id} // Use id as key for uniqueness
                  type="button"
                  className="w-full text-left p-3 hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    setValue("bankCode", bank.code, { shouldValidate: true });
                    setShowBankDropdown(false);
                  }}
                >
                  {bank.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <CustomButton
        type="submit"
        disabled={isVerifying || isLoading}
        className={`w-full py-3 rounded-full text-white ${
          !isVerifying && !isLoading
            ? "bg-positive-800 hover:bg-primary-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isVerifying
          ? "Is verifying..."
          : isLoading
          ? "Adding... "
          : "Add Bank"}
      </CustomButton>
    </form>
  );
};
