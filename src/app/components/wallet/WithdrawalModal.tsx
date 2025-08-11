import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";

// Define the type for payoutBanks if it's a single bank object
type PayoutBank = {
  id: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
};
import {
  setWithdrawalData,
  setWithdrawalModal,
  setWithdrawalPinModal,
  useWallet,
} from "@/app/store/walletSlice";
import { store } from "@/app/store/store";
import CustomButton from "@/app/utils/CustomBtn";

export type BankAccount = {
  id: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
};

// Zod schema for validation
const withdrawalFormSchema = z.object({
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
  bank: z.string().min(1, "Please select a bank"), // Make bank required
});

type WithdrawalFormData = z.infer<typeof withdrawalFormSchema>;

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBank: () => void;
}

const predefinedAmounts = [
  // { label: "₦500", value: 500 },
  // { label: "₦1,000", value: 1000 },
  { label: "₦2,000", value: 2000 },
  { label: "₦3,000", value: 3000 },
  { label: "₦5,000", value: 5000 },
  { label: "₦10,000", value: 10000 },
];

export default function WithdrawalModal({
  open,
  onOpenChange,
  onAddBank,
}: WithdrawalModalProps) {
  const { payoutBanks } = useSelector(useWallet) as {
    payoutBanks: PayoutBank | undefined;
  };
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: "",
      bank: payoutBanks && payoutBanks.id ? String(payoutBanks.id) : "",
    },
  });

  const handleFormSubmit = (data: WithdrawalFormData) => {
    console.log("Form Data:", data);
    const numericAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));
    if (!payoutBanks || !payoutBanks.id) {
      console.error("No bank available");
      return;
    }
    const payload = {
      amount: numericAmount,
      bankAccount: {
        accountNumber: payoutBanks.accountNumber,
        bankName: payoutBanks.bankName,
        accountName: payoutBanks.accountName,
      },
    };
    store.dispatch(setWithdrawalData(payload));
    reset();
    setSelectedAmount(null);
    store.dispatch(setWithdrawalModal(false));
    store.dispatch(setWithdrawalPinModal(true));
  };

  const handlePredefinedAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  const handleCustomAmountChange = () => {
    setSelectedAmount(null);
  };

  // Animation variants for the overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Animation variants for the modal
  const modalVariants = {
    hidden: {
      y: "50%",
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      y: "30%",
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90vw] max-w-[600px] shadow-lg"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center mb-2">
                  <Dialog.Title className="text-2xl font-semibold">
                    Withdraw
                  </Dialog.Title>
                  <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                    <Cross2Icon className="w-6 h-6" />
                  </Dialog.Close>
                </div>

                <p className="text-gray-600 mb-6">
                  Withdraw your money directly to your Bank account
                </p>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block mb-2 text-gray-800">
                      Enter the amount you want to withdraw
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
                      } rounded-lg px-4 py-3 focus:outline-none focus:ring-transparent`}
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
                        onClick={() =>
                          handlePredefinedAmountClick(option.value)
                        }
                        className={`px-5 py-2 rounded ${
                          selectedAmount === option.value
                            ? "bg-[#E4F1FA] text-primary-900"
                            : "bg-gray-100 text-gray-800"
                        } hover:bg-blue-50`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-800">
                      Bank Account
                    </label>
                    {payoutBanks && payoutBanks.accountNumber ? (
                      <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex flex-col gap-1">
                        <span className="font-medium text-gray-900">
                          {payoutBanks.accountName}
                        </span>
                        <span className="text-gray-700">
                          {payoutBanks.accountNumber}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {payoutBanks.bankName}
                        </span>
                      </div>
                    ) : (
                      <div className="text-gray-600">No bank added yet</div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onAddBank}
                    className="flex items-center cursor-pointer text-primary-900 font-medium mt-2 ml-auto"
                  >
                    <Plus className="text-primary-900 size-5" />
                    Add New Bank
                  </button>

                  <CustomButton
                    type="submit"
                    className="bg-primary-900 text-white w-full rounded-full py-3 hover:bg-primary-900 mt-8"
                    disabled={isSubmitting || !payoutBanks || !payoutBanks.id}
                  >
                    Proceed
                  </CustomButton>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
