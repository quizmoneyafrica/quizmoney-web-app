import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import CustomTextField from "@/app/utils/CustomTextField";
import CustomButton from "@/app/utils/CustomBtn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Zod schema for validation
const depositFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number(val.replace(/[₦,]/g, ""));
        return !isNaN(num) && num > 0;
      },
      { message: "Please enter a valid amount" }
    ),
});

type DepositFormData = z.infer<typeof depositFormSchema>;

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { amount: number }) => void;
}

const predefinedAmounts = [
  { label: "₦500", value: 500 },
  { label: "₦1,000", value: 1000 },
  { label: "₦2,000", value: 2000 },
  { label: "₦5,000", value: 5000 },
];

export default function DepositModal({
  open,
  onOpenChange,
  onSubmit,
}: DepositModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  const handleFormSubmit = (data: DepositFormData) => {
    const numericAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));
    onSubmit({ amount: numericAmount });
    reset();
    setSelectedAmount(null);
  };

  const handlePredefinedAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAmount(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90vw] max-w-[600px] shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <Dialog.Title className="text-2xl font-semibold">
              Deposit
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
              <Cross2Icon className="w-6 h-6" />
            </Dialog.Close>
          </div>

          <p className="text-gray-600 mb-6">
            Fund your QuizMoney wallet Let's play
          </p>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-800">
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
                } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent`}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {predefinedAmounts.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePredefinedAmountClick(option.value)}
                  className={`px-5 py-1 rounded ${
                    selectedAmount === option.value
                      ? "bg-[#E4F1FA] text-primary-900"
                      : "bg-gray-100 text-gray-800"
                  } hover:bg-blue-50`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <CustomButton
              type="submit"
              className="bg-blue-600 text-white w-full rounded-full py-2 hover:bg-blue-700 mt-8"
              disabled={isSubmitting}
            >
              Proceed
            </CustomButton>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
