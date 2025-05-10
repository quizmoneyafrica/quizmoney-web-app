import CustomButton from "@/app/utils/CustomBtn";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import CustomImage from "./CustomImage";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema with Zod
const bankAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(10, { message: "Account number must be at least 10 digits" })
    .max(10, { message: "Account number must be exactly 10 digits" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  bank: z.string().min(1, { message: "Please select a bank" }),
});

// Infer TypeScript type from schema
type BankAccountFormData = z.infer<typeof bankAccountSchema>;

export const MobileAddBankAccount = ({
  onSubmit,
}: {
  onSubmit: (data: BankAccountFormData) => void;
}) => {
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountName, setAccountName] = useState("");

  const banks = [
    "ACCESS BANK",
    "ZENITH BANK",
    "GTB BANK",
    "FIRST BANK",
    "UBA BANK",
  ];

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    mode: "onChange",
    defaultValues: {
      accountNumber: "",
      bank: "ACCESS BANK",
    },
  });

  // Watch form values
  const selectedBank = watch("bank");
  const accountNumber = watch("accountNumber");

  // Simulate account name fetch when account number and bank are entered
  useEffect(() => {
    const fetchAccountName = async () => {
      if (accountNumber && accountNumber.length === 10 && selectedBank) {
        // This would be an API call in a real application
        // For now, we'll simulate a delay and return a static name
        setTimeout(() => {
          setAccountName("John Doe");
        }, 500);
      } else {
        setAccountName("");
      }
    };

    fetchAccountName();
  }, [accountNumber, selectedBank]);

  // Form submission handler
  const onFormSubmit = (data: BankAccountFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <p className="text-gray-600 mb-6">Add your bank account for withdrawal</p>

      <div className="mb-5">
        <label className="block text-gray-800 font-medium mb-2">
          Enter Account Number
        </label>
        <input
          type="text"
          {...register("accountNumber")}
          className={`w-full border ${
            errors.accountNumber ? "border-red-500" : "border-gray-300"
          } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.accountNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-800 font-medium mb-2">
          Select Bank you want to withdraw to
        </label>
        <div className="relative">
          <button
            className={`w-full border ${
              errors.bank ? "border-red-500" : "border-gray-300"
            } rounded-lg p-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => setShowBankDropdown(!showBankDropdown)}
            type="button"
          >
            <div className="flex items-center">
              {selectedBank === "ACCESS BANK" && (
                <CustomImage
                  src={"/icons/access-logo.svg"}
                  alt="Access Bank logo"
                  className="mr-2"
                />
              )}
              {selectedBank}
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </button>

          {errors.bank && (
            <p className="text-red-500 text-sm mt-1">{errors.bank.message}</p>
          )}

          {showBankDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {banks.map((bank) => (
                <button
                  key={bank}
                  className="w-full text-left p-3 hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    setValue("bank", bank, { shouldValidate: true });
                    setShowBankDropdown(false);
                  }}
                  type="button"
                >
                  {bank === "ACCESS BANK" && (
                    <CustomImage
                      src={"/icons/access-logo.svg"}
                      alt="Access Bank logo"
                      className="mr-2"
                    />
                  )}
                  {bank}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {accountName && (
        <div className="text-primary-800 font-medium mb-8">{accountName}</div>
      )}

      <CustomButton
        type="submit"
        disabled={!isValid || !accountName}
        className={`${
          isValid && accountName
            ? "bg-positive-800 hover:bg-primary-600"
            : "bg-gray-400 cursor-not-allowed"
        } text-white rounded-full px-6 mt-6 w-full py-3`}
      >
        Add Bank
      </CustomButton>
    </form>
  );
};
