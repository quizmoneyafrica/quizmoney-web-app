import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletApi from "@/app/api/wallet";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";

// Zod schema for validation
const depositFormSchema = z.object({
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
});

type DepositFormData = z.infer<typeof depositFormSchema>;

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const predefinedAmounts = [
  { label: "₦1,000", value: 1000 },
  { label: "₦1,500", value: 1500 },
  { label: "₦2,000", value: 2000 },
  { label: "₦5,000", value: 5000 },
];

export default function DepositModal({
  open,
  onOpenChange,
}: DepositModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  const handleFormSubmit = async (data: DepositFormData) => {
    const numericAmount =
      selectedAmount || Number(data.amount.replace(/[₦,]/g, ""));
    try {
      setLoading(true);
      const response = await WalletApi.getCheckoutLink({
        amount: `${numericAmount}`,
      });

      if (
        response?.data?.result?.status === "success" ||
        response?.data.result?.data?.link
      ) {
        onOpenChange(false);
        reset();
        setSelectedAmount(null);
        window.location.href = response?.data.result.data.link;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setLoading(false);
    }
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
                    Deposit
                  </Dialog.Title>
                  <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                    <Cross2Icon className="w-6 h-6" />
                  </Dialog.Close>
                </div>

                <p className="text-gray-600 mb-6">
                  {"Fund your QuizMoney wallet Let's play"}
                </p>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block mb-2 text-gray-800">
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
                      } rounded-lg px-4 py-2 focus:outline-none focus:ring-transparent`}
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
                        className={`px-5 py-1 rounded cursor-pointer ${
                          selectedAmount === option.value
                            ? "bg-[#E4F1FA] text-primary-900"
                            : "bg-gray-100 text-gray-800"
                        } hover:bg-blue-50`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="bg-primary-900 text-white items-center justify-center flex-row flex cursor-pointer w-full rounded-full py-3 hover:bg-primary-700 mt-8"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className=" animate-spin border-b-2 border-b-white rounded-full size-5" />
                    ) : (
                      "Proceed"
                    )}
                  </button>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
