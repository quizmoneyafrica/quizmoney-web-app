import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WalletApi from "@/app/api/wallet";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";

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

type DepositFormData = z.infer<typeof depositFormSchema>;

export const MobileDepositForm = ({ close }: { close?: () => void }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const amountOptions = [
    { value: 600, label: "₦600" },
    { value: 1000, label: "₦1,000" },
    { value: 2000, label: "₦2,000" },
    { value: 5000, label: "₦5,000" },
  ];
  const [loading, setLoading] = useState(false);

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

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  const handleCustomAmountChange = () => {
    setSelectedAmount(null);
  };

  const onFormSubmit = async (data: DepositFormData) => {
    const numericAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));

    try {
      setLoading(true);
      const response = await WalletApi.getCheckoutLink({
        amount: `${numericAmount}`,
      });
      if (
        response?.data?.result?.status === "success" ||
        response?.data.result?.data?.link
      ) {
        reset();
        setSelectedAmount(null);
        window.location.href = response?.data.result.data.link;
        close?.();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white rounded-3xl h-full">
      <div className="mb-8">
        <p className="text-gray-600">
          {"Fund your QuizMoney wallet Let's play"}
        </p>
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

        <div className="flex flex-wrap gap-2 mb-20">
          {amountOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAmountSelect(option.value)}
              className={`flex-1 text-sm px-4 py-2 rounded-lg ${
                selectedAmount === option.value
                  ? "bg-[#E4F1FA] text-primary-900"
                  : "bg-gray-100 text-gray-800"
              } hover:bg-[#E4F1FA] min-w-20 text-center`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="bg-primary-900 text-white items-center justify-center flex flex-row w-full cursor-pointer rounded-full py-4 hover:bg-primary-700"
        >
          {loading ? (
            <div className=" animate-spin border-b-2 border-b-white rounded-full size-4" />
          ) : (
            "Proceed"
          )}
        </button>
      </form>
    </div>
  );
};
