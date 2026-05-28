"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";
import { useVirtualAccount, useSetupVirtualAccount } from "@/lib/queries";
import { BankIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import { formatNaira } from "@/app/utils/utils";
import { LucideCopy } from "lucide-react";

type Props = {
  amount: number;
  isBvnCompleted: boolean;
};

export default function VirtualDetails({ amount, isBvnCompleted }: Props) {
  // const queryClient = useQueryClient();

  const { data: vaResponse, isLoading: isFetching } = useVirtualAccount();
  const { mutateAsync: createVA, isPending: isCreating } =
    useSetupVirtualAccount();

  const account = vaResponse?.account;
  const isEligible = isBvnCompleted && vaResponse?.is_fully_verified;

  // Auto-create if eligible and no account
  useEffect(() => {
    if (isEligible && !account && !isFetching && !isCreating) {
      createVA().catch((err) => {
        console.error(err);
      });
    }
  }, [isEligible, account, isFetching, isCreating, createVA]);

  const copyAll = async () => {
    if (!account) return;
    const text = `Account Number: ${account.account_number}\nBank: ${account.bank_name}\nAmount: ${formatNaira(amount)}`;
    await navigator.clipboard.writeText(text);
    toast.success("Details copied!");
  };

  if (isFetching || isCreating) {
    return (
      <div className="py-12 text-center">
        Setting up your virtual account...
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-10">
        <p>Unable to setup virtual account.</p>
        {isEligible && (
          <CustomButton onClick={() => createVA()} className="mt-4">
            Try Again
          </CustomButton>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="bg-primary-50 p-5 rounded-2xl space-y-5">
        <CardCopy title="Account Number" value={account.account_number} />
        <CardCopy title="Bank Name" value={account.bank_name} />
        <CardCopy title="Send Exactly" value={formatNaira(amount)} />

        <CustomButton width="full" onClick={copyAll}>
          Copy All Details
        </CustomButton>
      </div>

      <div className="bg-amber-50 border border-amber-400 p-4 rounded-2xl text-sm">
        Transfer <strong>exactly {formatNaira(amount)}</strong> to this account
        from any bank. Money will be credited to your wallet{" "}
        <strong>instantly</strong>.
      </div>
    </div>
  );
}

const CardCopy = ({ title, value }: { title: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
    toast.success(`${title} copied`);
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl">
      <div className="flex gap-3 items-center">
        <div className="w-11 h-11 bg-primary-900 text-white rounded-full flex items-center justify-center">
          <BankIcon />
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="font-semibold text-lg">{value}</p>
        </div>
      </div>
      <button onClick={copy}>
        <LucideCopy
          className={`w-5 h-5 ${copied ? "text-green-600" : "text-gray-400"}`}
        />
      </button>
    </div>
  );
};
