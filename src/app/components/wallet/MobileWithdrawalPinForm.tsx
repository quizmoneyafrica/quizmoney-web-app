import { useState } from "react";
import CustomButton from "@/app/utils/CustomBtn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Dummy bank data
const dummyBanks = [
  { id: "1", name: "Firstbank", accountNumber: "1234567890" },
  { id: "2", name: "GTBank", accountNumber: "0987654321" },
];

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

export const MobileWithdrawalPinForm = ({
  onSubmit,
  close,
  banks = dummyBanks, // Allow override or use dummy
}: {
  onSubmit: (data: { amount: number; bankId: string }) => void;
  close?: () => void;
  banks?: typeof dummyBanks;
}) => {
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
      bankId: banks[0]?.id || "",
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
    onSubmit({ amount: numericAmount, bankId: data.bankId });
    reset();
    setSelectedAmount(null);
    close?.();
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
          <select
            {...register("bankId")}
            className={`w-full border ${
              errors.bankId ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent`}
          >
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.accountNumber} - {bank.name}
              </option>
            ))}
          </select>
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
        >
          Proceed
        </CustomButton>
      </form>
    </div>
  );
};
