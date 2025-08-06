import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WalletApi from "@/app/api/wallet";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import CustomButton from "@/app/utils/CustomBtn";
import VirtualDetails, { VirtualDetailsProps } from "./VirtualDetails";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { usePaystackPayment } from "react-paystack";
import { Loader } from "lucide-react";
import { getAuthUser } from "@/app/api/userApi";

// Declare Paystack type for TypeScript
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        onSuccess: (transaction: any) => void;
        onLoad: (response: any) => void;
        onCancel: () => void;
        onError: (error: any) => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

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
  const { email: userEmail }: any = getAuthUser();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "bankTransfer" | "card" | ""
  >("card");
  const [showVirtual, setShowVirtual] = useState(false);
  const [virtualAmount, setVirtualAmount] = useState<number | null>(null);
  const dispatch = useAppDispatch();

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

  const initializePaystackPayment = (
    accessCode: string,
    reference: string,
    amount: number
  ) => {
    const initializePayment = usePaystackPayment({
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: userEmail,
      amount: amount * 100,
      reference: reference,
    });
    initializePayment({
      onSuccess: function (transaction: any) {
        toast.success("Payment successful!", {
          position: toastPosition,
        });
        reset();
        setSelectedAmount(null);
        close?.();
      },
      onClose: function (error: any) {
        toast.error("Payment failed. Please try again.", {
          position: toastPosition,
        });
        console.error("Payment error:", JSON.stringify(error, null, 2));
      },
    });
  };

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
    const totalAmount = baseAmount;

    if (selectedPaymentMethod === "bankTransfer") {
      setVirtualAmount(baseAmount);
      setShowVirtual(true);
    } else {
      try {
        setLoading(true);

        const response = await WalletApi.initializePaystack({
          amount: totalAmount,
        });
        console.log("=======userEmail=============================");
        console.log(userEmail);
        console.log("====================================");
        console.log(JSON.stringify(response, null, 2), "====PAYSTACK=======");

        if (
          response.success &&
          response.data?.accessCode &&
          response.data?.reference
        ) {
          // Initialize Paystack popup
          initializePaystackPayment(
            response.data.accessCode,
            response.data.reference,
            totalAmount
          );
        } else {
          toast.error("Failed to initialize payment. Please try again.", {
            position: toastPosition,
          });
        }
      } catch (err: any) {
        toast.error(`${err.message}`, {
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
                <label className="flex items-center gap-2 text-sm bg-white border border-neutral-300 checked:border-primary-900 p-4 rounded-[10px]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bankTransfer"
                    checked={selectedPaymentMethod === "bankTransfer"}
                    onChange={() => setSelectedPaymentMethod("bankTransfer")}
                    className="accent-[#17478B] size-5"
                  />
                  Pay with Bank Transfer
                </label>

                <label className="flex items-center gap-2 text-sm bg-white border border-neutral-300 checked:border-primary-900 p-4 rounded-[10px]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={selectedPaymentMethod === "card"}
                    onChange={() => setSelectedPaymentMethod("card")}
                    className="accent-[#17478B] size-5"
                  />
                  Pay with PayStack{" "}
                </label>
              </div>
            </div>

            <CustomButton
              loaderComponent={
                <Loader className=" mr-2 text-white animate-spin size-5" />
              }
              width="full"
              disabled={loading}
              loader={loading}
              type="submit"
            >
              Proceed
            </CustomButton>
          </form>
        </div>
      ) : (
        <VirtualDetails amount={virtualAmount || 0} />
      )}
    </>
  );
};
