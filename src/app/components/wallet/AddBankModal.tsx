import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import CustomTextField from "@/app/utils/CustomTextField";
import CustomSelect from "@/app/utils/CustomSelect";
import CustomButton from "@/app/utils/CustomBtn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletApi from "@/app/api/wallet";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useWallet } from "@/app/store/walletSlice";
import { getAuthUser } from "@/app/api/userApi";

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
}

export default function AddBankModal({
  open,
  onOpenChange,
  initialData = { accountNumber: "", bank: "" },
}: AddBankModalProps) {
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: initialData,
  });

  const { banks } = useSelector(useWallet);
  const formattedBanks = banks
    ?.map((bank) => ({
      label: bank.name,
      value: bank.code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: BankFormData) => {
    const { email } = await getAuthUser();

    try {
      setIsVerifying(true);

      console.log("====================================");
      console.log(
        JSON.stringify({
          email: email,
          accountNumber: data?.accountNumber,
          bankCode: Number(data?.bank),
        }),
        null,
        2
      );
      console.log("====================================");
      const response = await WalletApi.verifyAccount({
        email: email,
        accountNumber: data?.accountNumber,
        bankCode: Number(data?.bank),
      });
      console.log("============verifyAccount========================");
      console.log(JSON.stringify(response?.data));
      console.log("============verifyAccount========================");
      if (response?.data?.result?.status === "success") {
        // reset();
        // close?.();
        addVerifiedAccount({
          accountNumber: "",
          bankName: "",
          accountName: "",
        });
      }
      if (response?.data?.result?.status === "error") {
        toast.error(`${response?.data?.result?.message}`, {
          position: toastPosition,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("WalletApi.verifyAccount", err);
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsVerifying(false);
    }
  };
  const addVerifiedAccount = async (data: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await WalletApi.addBankAccount({
        ...data,
      });
      if (
        response?.data?.result?.status === "success" ||
        response?.data.result?.data?.link
      ) {
        reset();
        close?.();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <CustomTextField
                      label="Account Number"
                      type="number"
                      onChange={(e) =>
                        setValue("accountNumber", e.target.value)
                      }
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
                      options={formattedBanks}
                      disabledOption="Select your bank"
                      className="border rounded-3xl px-4 py-2 w-full"
                      onChange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLSelectElement
                        >
                      ) => {
                        const target = e.target as
                          | HTMLInputElement
                          | HTMLSelectElement;
                        const { value } = target;
                        setValue("bank", value);
                      }}
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
                    disabled={isVerifying || isLoading}
                  >
                    {isVerifying
                      ? "Is verifying..."
                      : isLoading
                      ? "Adding... "
                      : "Add Bank"}
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
