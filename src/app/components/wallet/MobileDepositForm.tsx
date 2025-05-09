import { useState } from "react";
import CustomButton from "@/app/utils/CustomBtn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema with Zod
const depositFormSchema = z.object({
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
});

// Infer TypeScript type from schema
type DepositFormData = z.infer<typeof depositFormSchema>;

export const MobileDepositForm = ({
  onSubmit,
  close,
}: {
  onSubmit: (data: { amount: number }) => void;
  close?: () => void;
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // Predefined amount options
  const amountOptions = [
    { value: 500, label: "₦500" },
    { value: 1000, label: "₦1,000" },
    { value: 2000, label: "₦2,000" },
    { value: 5000, label: "₦5,000" },
  ];

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema),
    mode: "onChange",
    defaultValues: {
      amount: "",
    },
  });

  // Handle predefined amount selection
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAmount(null);
  };

  // Form submission handler
  const onFormSubmit = (data: DepositFormData) => {
    const numericAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));
    onSubmit({ amount: numericAmount });
    reset();
    setSelectedAmount(null);
    close?.();
  };

  return (
    <div className=" bg-white rounded-3xl h-full">
      <div className="mb-8">
        <p className="text-gray-600">Fund your QuizMoney wallet Let's play</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-6">
          <label className="block text-gray-800 mb-3">
            Enter the amount you want to deposit
          </label>
          <input
            type="text"
            placeholder="Amount"
            {...register("amount")}
            onChange={(e) => {
              register("amount").onChange(e);
              handleCustomAmountChange(e);
            }}
            className={`w-full border ${
              errors.amount ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent `}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-20">
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
