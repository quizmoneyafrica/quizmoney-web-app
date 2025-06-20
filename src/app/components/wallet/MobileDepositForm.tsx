import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WalletApi from "@/app/api/wallet";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import CustomButton from "@/app/utils/CustomBtn";
import VirtualDetails from "./VirtualDetails";

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "bankTransfer" | "card" | ""
  >("card");
  const [showVirtual, setShowVirtual] = useState(false);

  const amountOptions = [
    { label: "₦1,000", value: 1000 },
    { label: "₦1,500", value: 1500 },
    { label: "₦2,000", value: 2000 },
    { label: "₦5,000", value: 5000 },
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

  // const calculatePaystackFee = (amount: number): number => {
  //   let fee = amount * 0.015;
  //   if (amount >= 2500) {
  //     fee += 100;
  //   }

  //   if (fee > 2000) {
  //     fee = 2000;
  //   }

  //   return fee;
  // };

  const onFormSubmit = async (data: DepositFormData) => {
    if (!selectedAmount && !data.amount) {
      toast.error("Please select an amount.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    const baseAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));
    // const paystackFee = calculatePaystackFee(baseAmount);
    const totalAmount = baseAmount;

    if (selectedPaymentMethod === "bankTransfer") {
      setShowVirtual(true);
    } else {
      try {
        setLoading(true);
        // const response = await WalletApi.getCheckoutLink({
        //   amount: `${numericAmount}`,
        // });
        const response = await WalletApi.getPaystackCheckoutLink({
          amount: `${totalAmount}`,
        });
        console.log(response.data.result);
        if (
          response?.data?.result?.status === true ||
          response?.data.result?.data?.authorization_url
        ) {
          reset();
          setSelectedAmount(null);
          window.location.href = response?.data.result.data.authorization_url;
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
    }
  };

  return (
    <>
      {!showVirtual ? (
        <div className="h-full">
          <div className="mb-8">
            <p className="text-gray-600">
              {"Fund your QuizMoney wallet Let's play"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {amountOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAmountSelect(option.value)}
                    className={`flex-1 text-sm px-4 py-2 rounded-lg cursor-pointer ${
                      selectedAmount === option.value
                        ? "bg-[#E4F1FA] text-primary-900"
                        : "bg-gray-100 text-gray-800"
                    } hover:bg-[#E4F1FA] min-w-20 text-center`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-medium">Choose a payment Option</p>
              <div className="space-y-4">
                {/* <label className="flex items-center gap-2 text-sm bg-white border border-neutral-300 checked:border-primary-900 p-4 rounded-[10px]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bankTransfer"
                    checked={selectedPaymentMethod === "bankTransfer"}
                    onChange={() => setSelectedPaymentMethod("bankTransfer")}
                    className="accent-blue-600"
                  />
                  Pay with Bank Transfer
                </label> */}

                <label className="flex items-center gap-2 text-sm bg-white border border-neutral-300 checked:border-primary-900 p-4 rounded-[10px]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={selectedPaymentMethod === "card"}
                    onChange={() => setSelectedPaymentMethod("card")}
                    className="accent-blue-600"
                  />
                  Pay with PayStack{" "}
                  {/* <span className="text-neutral-500 italic">
                    (Debit or Credit)
                  </span> */}
                </label>
              </div>
            </div>

            <CustomButton
              width="full"
              disabled={loading}
              loader={loading}
              type="submit"
            >
              {loading ? (
                <div className=" animate-spin border-b-2 border-b-white rounded-full size-4 mx-auto" />
              ) : (
                "Proceed"
              )}
            </CustomButton>
          </form>
        </div>
      ) : (
        <VirtualDetails />
      )}
    </>
  );
};
