import { useState } from "react";
import CustomButton from "@/app/utils/CustomBtn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import {
  setWithdrawalData,
  setWithdrawalModal,
  setWithdrawalPinModal,
  useWallet,
} from "@/app/store/walletSlice";
import { store } from "@/app/store/store";

export type BankAccount = {
  id: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
};

const withdrawFormSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine(
      (val) => {
        const num = Number(val.replace(/[₦,]/g, ""));
        return !isNaN(num) && num > 0;
      },
      { message: "Please enter a valid amount" }
    ),
  bankId: z.string().min(1, { message: "Please select a bank" }),
});

type WithdrawFormData = z.infer<typeof withdrawFormSchema>;

export const MobileWithdrawalForm = ({
  onAddBank,
  banks, // Allow override from props or use from wallet
}: {
  close?: () => void;
  banks?: BankAccount[];
  onAddBank: () => void;
}) => {
  const { wallet, payoutBanks } = useSelector(useWallet);
  // payoutBanks is now a single object
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const amountOptions = [
    { label: "₦5,000", value: 5000 },
    { label: "₦10,000", value: 10000 },
    { label: "₦20,000", value: 20000 },
    { label: "₦100,000", value: 100000 },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawFormSchema),
    mode: "onChange",
    defaultValues: {
      amount: "",
      bankId: payoutBanks && payoutBanks.id ? String(payoutBanks.id) : "",
    },
  });

  // Handle predefined amount selection
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  // Handle custom amount input
  const handleCustomAmountChange = () => {
    setSelectedAmount(null);
  };

  // Form submission handler
  const onFormSubmit = (data: WithdrawFormData) => {
    const numericAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));

    if (!payoutBanks || !payoutBanks.id) return;

    const payload = {
      amount: numericAmount,
      bankAccount: {
        accountNumber: payoutBanks.accountNumber,
        bankName: payoutBanks.bankName,
        accountName: (payoutBanks as any).accountName,
      },
    };

    store.dispatch(setWithdrawalData(payload));
    reset();
    setSelectedAmount(null);
    store.dispatch(setWithdrawalModal(false));
    store.dispatch(setWithdrawalPinModal(true));
  };

  return (
    <div className="bg-white rounded-3xl h-full">
      <p className="text-gray-600 mb-8">
        Withdraw your money directly to your Bank account
      </p>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-6">
          <label className="block text-gray-800 mb-3">
            Enter the amount you want to Withdraw
          </label>
          <input
            type="text"
            placeholder="Amount"
            {...register("amount")}
            onChange={(e) => {
              register("amount").onChange(e);
              handleCustomAmountChange();
            }}
            className={`w-full border ${
              errors.amount ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent `}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {amountOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAmountSelect(option.value)}
              className={`flex-1 px-4 py-2 rounded-lg ${
                selectedAmount === option.value
                  ? "bg-[#E4F1FA] text-primary-900"
                  : "bg-gray-100 text-gray-800"
              } hover:bg-[#E4F1FA] min-w-20 text-center`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 mb-3">Bank Account</label>
          {payoutBanks && payoutBanks.accountNumber ? (
            <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex flex-col gap-1">
              <span className="font-medium text-gray-900">
                {(payoutBanks as any).accountName}
              </span>
              <span className="text-gray-700">{payoutBanks.accountNumber}</span>
              <span className="text-gray-600 text-sm">
                {payoutBanks.bankName}
              </span>
            </div>
          ) : (
            <div className="text-gray-600">No bank added yet</div>
          )}
          <div className="flex items-center mt-2">
            <span className="text-primary-900 text-lg font-bold mr-2">+</span>
            <button
              type="button"
              className="text-primary-900 underline text-sm"
              onClick={onAddBank}
            >
              Add New Bank
            </button>
          </div>
        </div>
        <CustomButton
          type="submit"
          className="bg-primary-900 text-white w-full rounded-full py-4 hover:bg-primary-700"
          disabled={!payoutBanks || !payoutBanks.id}
        >
          Proceed
        </CustomButton>
      </form>
    </div>
  );
};
