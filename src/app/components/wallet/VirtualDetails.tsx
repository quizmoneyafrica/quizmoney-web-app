"use client";
import { BankIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import { formatNaira } from "@/app/utils/utils";
import { LucideCopy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function VirtualDetails() {
  return (
    <div className="space-y-4 pt-3 border-t border-neutral-100">
      <div className="bg-primary-50 p-4 rounded-[10px] space-y-6">
        <CardCopy title="Account Number" value="9944184241" />
        <CardCopy title="Bank Name" value="Paystack-Titan" />
        <CardCopy title="Amount" value={`${formatNaira(1000, true)}`} />
        <CustomButton width="full">Copy account details</CustomButton>
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
