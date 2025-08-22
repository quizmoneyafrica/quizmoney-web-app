"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import { BankIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import { formatNaira } from "@/app/utils/utils";
import { LucideCopy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export type VirtualDetailsProps = { amount?: number };
function VirtualDetails({ amount = 1000 }: VirtualDetailsProps) {
  const { wallet: walletData } = useAppSelector((state) => state.wallet);
  const wallet = walletData.find((w) => w.currency === "NGN")! || {};

  const handleCopyAll = async () => {
    const details = `Account Number: ${
      wallet?.walletAccountNumber || ""
    }\nBank Name: ${wallet?.bankName || ""}\nAmount: ${formatNaira(
      amount,
      true
    )}`;
    try {
      await navigator.clipboard.writeText(details);
      toast.success("All account details copied!", { position: "top-center" });
    } catch (err) {
      console.error("Failed to copy all details:", err);
      toast.error("Failed to copy account details.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="space-y-4 pt-3 border-t border-neutral-100">
      <div className="bg-primary-50 p-4 rounded-[10px] space-y-6">
        <CardCopy
          title="Account Number"
          value={wallet?.walletAccountNumber as string}
        />
        <CardCopy title="Bank Name" value={wallet?.bankName as string} />
        <CardCopy title="Amount" value={`${formatNaira(amount, true)}`} />
        <CustomButton width="full" onClick={handleCopyAll}>
          Copy account details
        </CustomButton>
      </div>
      <div className="bg-warning-50 p-4 rounded-[10px] border border-warning-500 flex gap-2 items-start">
        <div>⚠</div>
        <div>
          <p className="text-sm">
            This is your dedicated virtual account. Funds transferred to this
            account will be credited to your wallet instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VirtualDetails;

type Props = {
  title: string;
  value: string;
};

const CardCopy = ({ title, value }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("copied successfully", { position: "top-center" });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-[40px] w-[40px] text-white grid place-items-center rounded-full bg-primary-900">
          <BankIcon />
        </div>
        <div className="col-span-2">
          <p>{title}</p>
          <h3 className="text-primary-900 text-lg font-bold">{value}</h3>
        </div>
      </div>

      <div>
        <button onClick={handleCopy} title="Copy to clipboard">
          <LucideCopy
            className={`h-5 w-5 ${copied ? "text-green-600" : "text-gray-600"}`}
          />
        </button>
      </div>
    </div>
  );
};
