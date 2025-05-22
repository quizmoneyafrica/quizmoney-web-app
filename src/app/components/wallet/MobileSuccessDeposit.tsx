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

export const MobileSuccessDeposit = ({ close }: { close?: () => void }) => {
  return (
    <div className=" bg-white rounded-3xl h-full">
      <div className="mb-8">
        <p className="text-gray-600">
          {"Fund your QuizMoney wallet Let's play"}
        </p>
      </div>
    </div>
  );
};
