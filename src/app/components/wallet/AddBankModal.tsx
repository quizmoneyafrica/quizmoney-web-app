import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import CustomTextField from "@/app/utils/CustomTextField";
import CustomSelect from "@/app/utils/CustomSelect";
import CustomButton from "@/app/utils/CustomBtn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bankFormSchema = z.object({
  accountNumber: z
    .string()
    .length(10, "Account number must be exactly 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  bank: z.string().nonempty("Please select a bank"),
});

type BankFormData = z.infer<typeof bankFormSchema>;

interface AddBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: BankFormData;
  onSubmit: (data: BankFormData) => void;
}

const banks = [
  { label: "Access Bank", value: "access" },
  { label: "GTBank", value: "gtbank" },
  { label: "First Bank", value: "firstbank" },
  { label: "UBA", value: "uba" },
  { label: "Zenith Bank", value: "zenith" },
];

export default function AddBankModal({
  open,
  onOpenChange,
  initialData = { accountNumber: "", bank: "" },
  onSubmit,
}: AddBankModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: initialData,
  });

  const prevInitialData = useRef<BankFormData>(initialData);

  useEffect(() => {
    if (
      open &&
      (prevInitialData.current.accountNumber !== initialData.accountNumber ||
        prevInitialData.current.bank !== initialData.bank)
    ) {
      reset(initialData);
      prevInitialData.current = initialData;
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = useCallback(
    handleSubmit((data) => {
      onSubmit(data);
    }),
    [handleSubmit, onSubmit]
  );

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
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-semibold">
                    Add New Bank
                  </Dialog.Title>
                  <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                    <Cross2Icon className="w-5 h-5" />
                  </Dialog.Close>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <CustomTextField
                      label="Account Number"
                      {...register("accountNumber")}
                      placeholder="Enter 10-digit account number"
                      className="border rounded-3xl px-4 py-2 w-full"
                    />
                    {errors.accountNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accountNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <CustomSelect
                      label="Select Bank"
                      options={banks}
                      disabledOption="Select your bank"
                      className="border rounded-3xl px-4 py-2 w-full"
                      {...register("bank")}
                    />
                    {errors.bank && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bank.message}
                      </p>
                    )}
                  </div>

                  <CustomButton
                    type="submit"
                    className="bg-positive-800 text-white rounded-full px-6 hover:bg-primary-600 mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Bank"}
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
