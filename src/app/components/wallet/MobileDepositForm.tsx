/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formatNaira, toastPosition } from "@/app/utils/utils";
import CustomButton from "@/app/utils/CustomBtn";
import VirtualDetails from "./VirtualDetails";
import { useKycStep } from "@/app/hooks/useKycStep";
import { useAuthStore } from "@/lib/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { api } from "@/lib/api-client";
import { usePaystackPayment } from "react-paystack";

// ─── Schema ───────────────────────────────────────────────────────────────────

const depositFormSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine(
      (val) => {
        const num = Number(val.replace(/[₦,]/g, ""));
        return !isNaN(num) && num > 0;
      },
      { message: "Please enter a valid amount" },
    ),
});

type DepositFormData = z.infer<typeof depositFormSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const AMOUNT_OPTIONS = [
  { label: "₦1,000", value: 1000 },
  { label: "₦1,500", value: 1500 },
  { label: "₦2,000", value: 2000 },
  { label: "₦5,000", value: 5000 },
];

// ─── Inner component — needs paystackConfig so hook is called at top level ───

interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // kobo
  publicKey: string;
}

interface InnerFormProps {
  close?: () => void;
}

function InnerDepositForm({ close }: InnerFormProps) {
  const { canHaveVirtualAccount } = useKycStep();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "bankTransfer" | "card"
  >(canHaveVirtualAccount ? "bankTransfer" : "card");
  const [showVirtual, setShowVirtual] = useState(false);
  const [virtualAmount, setVirtualAmount] = useState<number | null>(null);
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);

  // Paystack config — populated after backend responds
  const [paystackConfig, setPaystackConfig] = useState<PaystackConfig>({
    reference: "",
    email: user?.email || "",
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  });

  // usePaystackPayment must be called unconditionally at the top level.
  // It re-reads paystackConfig each render, so updating state before
  // calling initializePayment() gives it the correct reference + amount.
  const initializePayment = usePaystackPayment(paystackConfig);

  // We use a ref to trigger payment after state has been set and re-rendered.
  // Direct call after setState won't work because state updates are async.
  const pendingPayment = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema),
    mode: "onChange",
    defaultValues: { amount: "" },
  });

  const invalidateWallet = () => {
    // Balance
    queryClient.invalidateQueries({
      queryKey: queryKeys.walletBalance,
    });

    // Transactions - More aggressive invalidation
    queryClient.invalidateQueries({
      queryKey: queryKeys.walletTransactions(),
      exact: false,
    });

    // Alternative / Extra safety (if above doesn't work)
    queryClient.invalidateQueries({
      queryKey: ["wallet", "transactions"],
    });
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  const onFormSubmit = async (data: DepositFormData) => {
    setAmountError("");

    const baseAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));

    if (!baseAmount) {
      toast.error("Please enter an amount.", { position: toastPosition });
      return;
    }

    if (baseAmount < 1000) {
      setAmountError(`Minimum deposit is ${formatNaira(1000)}`);
      return;
    }

    // ── Virtual account (bank transfer) ──────────────────────────────────────
    if (selectedPaymentMethod === "bankTransfer") {
      setVirtualAmount(baseAmount);
      setShowVirtual(true);
      return;
    }

    // ── Paystack inline popup ─────────────────────────────────────────────────
    try {
      setLoading(true);

      // Backend generates a unique reference and initialises the transaction
      const res = await api.post<{
        success: boolean;
        data: {
          authorization_url: string;
          reference: string;
          amount: number;
          amount_formatted: string;
        };
      }>("/api/wallet/deposit", { amount: baseAmount * 100 }); // send kobo

      const { reference } = res.data.data;

      if (!reference) {
        toast.error("Failed to initialise payment. Try again.");
        setLoading(false);
        return;
      }

      // Update config with the server-generated reference.
      // usePaystackPayment reads this on next render, so we trigger the
      // popup in the next tick via pendingPayment ref + useEffect pattern.
      setPaystackConfig({
        reference,
        email: user?.email || "",
        amount: baseAmount * 100, // kobo — must match what backend sent to Paystack
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
      });

      // Mark that we want to open the popup once config state has updated
      pendingPayment.current = true;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Payment failed",
        { position: toastPosition },
      );
      setLoading(false);
    }
  };

  // Fire Paystack popup after paystackConfig state has settled
  // This effect runs whenever paystackConfig changes
  const prevRef = useRef("");
  if (
    pendingPayment.current &&
    paystackConfig.reference &&
    paystackConfig.reference !== prevRef.current
  ) {
    prevRef.current = paystackConfig.reference;
    pendingPayment.current = false;

    close?.(); // close the parent drawer/modal before popup opens

    initializePayment({
      onSuccess: () => {
        toast.success("Payment successful!", { position: toastPosition });
        invalidateWallet();
        setTimeout(invalidateWallet, 4500);
        reset();
        setSelectedAmount(null);
        setLoading(false);
      },
      onClose: () => {
        toast.info("Payment cancelled", { position: toastPosition });
        setLoading(false);
      },
    });
  }

  // ── Virtual account view ──────────────────────────────────────────────────

  if (showVirtual) {
    return (
      <VirtualDetails
        isBvnCompleted={canHaveVirtualAccount}
        amount={virtualAmount || 0}
      />
    );
  }

  // ── Form view ─────────────────────────────────────────────────────────────

  return (
    <div className="h-full">
      <div className="mb-8">
        <p className="text-gray-600">
          Fund your QuizMoney wallet. Let&apos;s play!
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Amount input */}
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
                setSelectedAmount(null);
              }}
              className={`w-full border ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent`}
            />
            {amountError && (
              <p className="text-red-500 text-sm mt-1">{amountError}</p>
            )}
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {AMOUNT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAmountSelect(option.value)}
                className={`flex-1 text-sm px-4 py-2 rounded-lg cursor-pointer min-w-20 text-center transition-colors ${
                  selectedAmount === option.value
                    ? "bg-[#E4F1FA] text-primary-900"
                    : "bg-gray-100 text-gray-800 hover:bg-[#E4F1FA]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div className="space-y-4">
          <p className="font-medium">Choose a payment option</p>
          <div className="space-y-4">
            {canHaveVirtualAccount && (
              <label className="flex items-center gap-2 text-sm bg-white border border-neutral-300 p-4 rounded-[10px] cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={selectedPaymentMethod === "bankTransfer"}
                  onChange={() => setSelectedPaymentMethod("bankTransfer")}
                  className="accent-[#17478B] size-5"
                />
                Pay with Virtual Account
              </label>
            )}

            <label className="flex items-center gap-2 text-sm bg-white border border-neutral-300 p-4 rounded-[10px] cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={selectedPaymentMethod === "card"}
                onChange={() => setSelectedPaymentMethod("card")}
                className="accent-[#17478B] size-5"
              />
              Pay with Paystack
            </label>
          </div>
        </div>

        <CustomButton
          width="full"
          disabled={loading}
          loader={loading}
          type="submit"
        >
          Proceed
        </CustomButton>
      </form>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
// Wrapped so usePaystackPayment is always called at component top level

export const MobileDepositForm = ({ close }: { close?: () => void }) => {
  return <InnerDepositForm close={close} />;
};
