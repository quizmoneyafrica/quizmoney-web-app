import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import CustomButton from "@/app/utils/CustomBtn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dummyBanks = [
  {
    id: "1",
    name: "First Bank of Nigeria",
    accountNumber: "1234567890",
  },
  {
    id: "2",
    name: "GTBank",
    accountNumber: "0987654321",
  },
  {
    id: "3",
    name: "Access Bank",
    accountNumber: "1122334455",
  },
];

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
  bank: z.string().optional(),
});

type WithdrawalFormData = z.infer<typeof withdrawalFormSchema>;

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { amount: number; bank?: string }) => void;
  onAddBank: () => void;
  banks: Array<{ id: string; name: string; accountNumber: string }>;
}

const predefinedAmounts = [
  { label: "₦500", value: 500 },
  { label: "₦1,000", value: 1000 },
  { label: "₦2,000", value: 2000 },
  { label: "₦5,000", value: 5000 },
];

export default function WithdrawalModal({
  open,
  onOpenChange,
  onSubmit,
  onAddBank,
}: WithdrawalModalProps) {
  const banks = dummyBanks;
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(
    banks.length > 0 ? banks[0].id : null
  );

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
      bank: banks.length > 0 ? banks[0].id : "",
    },
  });

  const handleFormSubmit = (data: WithdrawalFormData) => {
    const numericAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));
    onSubmit({
      amount: numericAmount,
      bank: selectedBank || undefined,
    });
    reset();
    setSelectedAmount(null);
  };

  const handlePredefinedAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", `₦${amount.toLocaleString()}`, { shouldValidate: true });
  };

  const handleCustomAmountChange = (e: unknown) => {
    setSelectedAmount(null);
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(e.target.value);
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
                        handleCustomAmountChange(e);
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
                      Select Bank you want to withdraw to
                    </label>
                    {banks.length > 0 ? (
                      <div className="relative">
                        <div className="relative w-full">
                          <select
                            {...register("bank")}
                            onChange={handleBankChange}
                            className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none"
                          >
                            {banks.map((bank) => (
                              <option key={bank.id} value={bank.id}>
                                {bank.accountNumber} - {bank.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 9L12 15L18 9"
                                stroke="#667085"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-600">No banks added yet</div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onAddBank}
                    className="flex items-center text-primary-900 font-medium mt-2 ml-auto"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <path
                        d="M10 4.16666V15.8333"
                        stroke="#1849A9"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.16669 10H15.8334"
                        stroke="#1849A9"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Add New Bank
                  </button>

                  <CustomButton
                    type="submit"
                    className="bg-primary-900 text-white w-full rounded-full py-3 hover:bg-blue-700 mt-8"
                    disabled={isSubmitting || banks.length === 0}
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
