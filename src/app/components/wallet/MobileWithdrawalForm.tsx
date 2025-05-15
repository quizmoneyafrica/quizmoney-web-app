import { useState } from "react";
import CustomButton from "@/app/utils/CustomBtn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import {
  setWithdrawalData,
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
  onSubmit,
  close,
  banks, // Allow override from props or use from wallet
}: {
  onSubmit: (data: { amount: number; bankAccount: BankAccount }) => void;
  close?: () => void;
  banks?: BankAccount[];
}) => {
  const { wallet } = useSelector(useWallet);
  // Use banks from props or from wallet
  const bankAccounts = banks || wallet?.bankAccounts || [];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const amountOptions = [
    { value: 500, label: "₦500" },
    { value: 1000, label: "₦1,000" },
    { value: 2000, label: "₦2,000" },
    { value: 5000, label: "₦5,000" },
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
      bankId: bankAccounts.length > 0 ? String(bankAccounts[0].id) : "",
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

    // Find the selected bank
    const selectedBankData = bankAccounts.find(
      (bank) => String(bank.id) === data.bankId
    );

    if (!selectedBankData) return;

    const payload = {
      amount: numericAmount,
      bankAccount: {
        accountNumber: selectedBankData.accountNumber,
        bankName: selectedBankData.bankName,
        accountName: selectedBankData.accountName,
      },
    };
    store.dispatch(setWithdrawalData(payload));

    reset();
    setSelectedAmount(null);
    close?.();
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
          <label className="block text-gray-800 mb-3">
            Select Bank you want to withdraw to
          </label>
          {bankAccounts.length > 0 ? (
            <select
              {...register("bankId")}
              className={`w-full border ${
                errors.bankId ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent`}
            >
              {bankAccounts.map((bank) => (
                <option key={bank.id} value={String(bank.id)}>
                  {bank.accountNumber} - {bank.bankName} - {bank.accountName}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-gray-600">No banks added yet</div>
          )}
          {errors.bankId && (
            <p className="text-red-500 text-sm mt-1">{errors.bankId.message}</p>
          )}
          <div className="flex items-center mt-2">
            <span className="text-primary-900 text-lg font-bold mr-2">+</span>
            <button
              type="button"
              className="text-primary-900 underline text-sm"
              onClick={() => alert("Add New Bank logic here")}
            >
              Add New Bank
            </button>
          </div>
        </div>
        <CustomButton
          type="submit"
          className="bg-primary-900 text-white w-full rounded-full py-4 hover:bg-primary-700"
          disabled={bankAccounts.length === 0}
        >
          Proceed
        </CustomButton>
      </form>
    </div>
  );
};
