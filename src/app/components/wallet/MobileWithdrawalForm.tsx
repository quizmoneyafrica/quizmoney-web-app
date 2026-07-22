/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import CustomButton from "@/app/utils/CustomBtn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "../game/modal/ModalWindow";
import { formatNaira } from "@/lib/utils";
import {
  useBankAccounts,
  useDeleteBankAccount,
  useRequestWithdrawal,
} from "@/lib/queries";

const withdrawFormSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine(
      (val: any) => {
        const num = Number(val.replace(/[₦,]/g, ""));
        return !isNaN(num) && num > 0;
      },
      { message: "Please enter a valid amount" },
    ),
});

type WithdrawFormData = z.infer<typeof withdrawFormSchema>;

const AMOUNT_OPTIONS = [
  { label: "₦5,000", value: 5000 },
  { label: "₦10,000", value: 10000 },
  { label: "₦20,000", value: 20000 },
  { label: "₦100,000", value: 100000 },
];

const MIN_WITHDRAWAL_NAIRA = 5000;

export const MobileWithdrawalForm = ({
  onAddBank,
  onSuccess,
}: {
  close?: () => void;
  onAddBank: () => void;
  onSuccess?: () => void;
}) => {
  const { data: bankAccounts = [], isLoading: banksLoading } =
    useBankAccounts();
  const deleteBank = useDeleteBankAccount();
  const requestWithdrawal = useRequestWithdrawal();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<string | null>(null);
  const [amountError, setAmountError] = useState("");

  // Prefer the default bank; fall back to the first saved account
  const activeBank =
    bankAccounts.find((b: any) => b.is_default) ?? bankAccounts[0] ?? null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawFormSchema),
    mode: "onChange",
    defaultValues: { amount: "" },
  });

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  const onFormSubmit = async (data: WithdrawFormData) => {
    setAmountError("");

    const amountNaira =
      selectedAmount ?? Number(data.amount.replace(/[₦,]/g, ""));

    if (!activeBank) return;

    if (amountNaira < MIN_WITHDRAWAL_NAIRA) {
      setAmountError(
        `Minimum withdrawal is ${formatNaira(MIN_WITHDRAWAL_NAIRA * 100)}`,
      );
      return;
    }

    try {
      await requestWithdrawal.mutateAsync({
        amount: amountNaira * 100, // naira → kobo
        bank_account_id: activeBank.id,
      });
      reset();
      setSelectedAmount(null);
      onSuccess?.();
    } catch {
      // Error toast already shown by useRequestWithdrawal's onError
    }
  };

  const handleDeleteConfirm = async () => {
    if (!bankToDelete) return;
    try {
      await deleteBank.mutateAsync(bankToDelete);
    } catch {
      // Error toast already shown by useDeleteBankAccount's onError
    } finally {
      setDeleteModalOpen(false);
      setBankToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl h-full">
      <p className="text-gray-600 mb-8">
        Withdraw your money directly to your Bank account
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Amount input */}
        <div className="mb-6">
          <label className="block text-gray-800 mb-3">
            Enter the amount you want to Withdraw
          </label>
          <input
            type="text"
            placeholder="Amount"
            {...register("amount")}
            onChange={(e) => {
              register("amount").onChange(e);
              setSelectedAmount(null); // clear preset selection on manual entry
            }}
            className={`w-full border ${
              errors.amount ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent`}
          />
          {amountError && (
            <p className="text-red-500 text-sm mt-1">{amountError}</p>
          )}
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Quick-select amounts */}
        <div className="flex flex-wrap gap-2 mb-6">
          {AMOUNT_OPTIONS.map((option) => (
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

        {/* Bank account */}
        <div className="mb-6">
          <label className="block text-gray-800 mb-3">Bank Account</label>

          {banksLoading ? (
            <div className="text-gray-400 text-sm">Loading accounts…</div>
          ) : activeBank ? (
            <div className="relative border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex flex-col gap-1">
              <span className="font-medium text-gray-900">
                {activeBank.account_name}
              </span>
              <span className="text-gray-700">{activeBank.account_number}</span>
              <span className="text-gray-600 text-sm">
                {activeBank.bank_name}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                className="absolute z-[1] right-2 top-1/2 -translate-y-1/2 text-error-700 bg-error-50 p-1 rounded"
                onClick={() => {
                  setBankToDelete(activeBank.id);
                  setDeleteModalOpen(true);
                }}
              >
                <Trash2Icon width={20} height={20} />
              </motion.button>
            </div>
          ) : (
            <div className="text-gray-600">No bank added yet</div>
          )}

          {!activeBank && !banksLoading && (
            <div className="flex items-center mt-2">
              <span className="text-primary-900 text-lg font-bold mr-2">+</span>
              <button
                type="button"
                className="text-primary-900 underline text-sm"
                onClick={onAddBank}
              >
                Add New Bank
              </button>
            </div>
          )}
        </div>

        <CustomButton
          type="submit"
          disabled={!activeBank || requestWithdrawal.isPending}
          loader={requestWithdrawal.isPending}
          className="bg-primary-900 text-white w-full rounded-full py-4 hover:bg-primary-700 disabled:cursor-not-allowed"
        >
          Proceed
        </CustomButton>
      </form>

      <Modal
        open={deleteModalOpen}
        handleClose={setDeleteModalOpen}
        title="Delete Payout"
        actionBtnText="Yes, Delete"
        showCloseIcon={false}
        actionOnClick={handleDeleteConfirm}
        redTitle
        actionLoader={deleteBank.isPending}
      >
        <p>Are you sure you want to delete your payout account?</p>
      </Modal>
    </div>
  );
};
