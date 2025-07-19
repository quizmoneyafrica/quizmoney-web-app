import CustomButton from "@/app/utils/CustomBtn";
import { Search, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthUser } from "@/app/api/userApi";
import WalletApi from "@/app/api/wallet";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import { setWallet, useWallet, setBanks } from "@/app/store/walletSlice";
import { useDispatch, useSelector } from "react-redux";
import { store } from "@/app/store/store";
import { UserObject } from "@/app/store/authSlice";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Define bank interface
export interface Bank {
  id: number;
  code: string;
  name: string;
}

type MobileAddBankAccountProps = {
  close?: () => void;
};

const bankAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(10, { message: "Account number must be at least 10 digits" })
    .max(10, { message: "Account number must be exactly 10 digits" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  bankCode: z.string().min(1, { message: "Please select a bank" }),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

export const MobileAddBankAccount = ({ close }: MobileAddBankAccountProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    mode: "onChange",
    defaultValues: {
      accountNumber: "",
      bankCode: "",
    },
  });

  const { banks } = useSelector(useWallet) as { banks: Bank[] };

  // Fetch banks if not already loaded
  useEffect(() => {
    const fetchBanks = async () => {
      if (banks.length === 0) {
        try {
          setIsLoadingBanks(true);
          const res = await WalletApi.fetchBanks();
          if (res.data || res.success) {
            dispatch(setBanks(res?.data || []));
          }
        } catch (error) {
          console.error("Error fetching banks:", error);
          toast.error("Failed to load banks", {
            position: toastPosition,
          });
        } finally {
          setIsLoadingBanks(false);
        }
      }
    };

    fetchBanks();
  }, [banks.length, dispatch]);

  const sortedBanks = useMemo(
    () => [...banks].sort((a, b) => a.name.localeCompare(b.name)),
    [banks]
  );

  const filteredBanks = useMemo(() => {
    if (!searchTerm.trim()) return sortedBanks;

    return sortedBanks.filter((bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [sortedBanks, searchTerm]);

  useEffect(() => {
    if (sortedBanks.length > 0 && !watch("bankCode")) {
      setValue("bankCode", sortedBanks[0].code, { shouldValidate: true });
    }
  }, [sortedBanks, setValue, watch]);

  const selectedBankCode = watch("bankCode");

  const onSubmit = async (data: BankAccountFormData) => {
    try {
      setIsLoading(true);
      const response = await WalletApi.addBankAccount(
        {
          accountNumber: data.accountNumber,
          bankCode: data.bankCode,
          bankName: banks.find((item) => item.code === data.bankCode)?.name,
        },
        store.dispatch
      );
      if (response?.success || response?.data || response.code === 200) {
        toast.success(response.data?.message, {
          position: toastPosition,
        });
        reset();
        close?.();
      }
    } catch (err: any) {
      toast.error(`${err.message} `, {
        position: toastPosition,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected bank details
  const selectedBank = banks.find((bank) => bank.code === selectedBankCode);

  const handleBankSelect = (bankCode: string) => {
    setValue("bankCode", bankCode, { shouldValidate: true });
    setIsDropdownOpen(false);
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchInputFocus = () => {
    setIsSearchFocused(true);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleSearchInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the blur is happening because user clicked inside the dropdown
    const relatedTarget = e.relatedTarget as HTMLElement;
    const dropdownContent = dropdownContentRef.current;

    // If focus is moving to something inside the dropdown, don't blur
    if (
      dropdownContent &&
      relatedTarget &&
      dropdownContent.contains(relatedTarget)
    ) {
      e.preventDefault();
      searchInputRef.current?.focus();
      return;
    }

    // Use a small delay to handle click events on dropdown items
    setTimeout(() => {
      setIsSearchFocused(false);
      if (!isDropdownOpen) {
        setSearchTerm("");
      }
    }, 150);
  };

  // Handle dropdown open change
  const handleDropdownOpenChange = (open: boolean) => {
    // If closing and search input is focused, prevent closing
    if (!open && isSearchFocused) {
      return;
    }

    setIsDropdownOpen(open);

    if (!open) {
      setSearchTerm("");
      setIsSearchFocused(false);
    } else {
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  // Handle clicking on dropdown items
  const handleDropdownItemClick = (bankCode: string) => {
    handleBankSelect(bankCode);
  };

  // Prevent dropdown from closing when clicking inside search area
  const handleSearchContainerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent blur from happening
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-gray-600">Add your bank account for withdrawal</p>

      <div>
        <label
          htmlFor="accountNumber"
          className="block text-gray-800 font-medium mb-2"
        >
          Account Number
        </label>
        <input
          id="accountNumber"
          type="text"
          {...register("accountNumber")}
          className={`w-full border ${
            errors.accountNumber ? "border-red-500" : "border-gray-300"
          } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-invalid={!!errors.accountNumber}
          aria-describedby={
            errors.accountNumber ? "accountNumber-error" : undefined
          }
        />
        {errors.accountNumber && (
          <p id="accountNumber-error" className="text-red-500 text-sm mt-1">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bankCode"
          className="block text-gray-800 font-medium mb-2"
        >
          Select Bank
        </label>
        <div className="relative">
          <DropdownMenu.Root
            open={isDropdownOpen}
            onOpenChange={handleDropdownOpenChange}
          >
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className={`w-full border ${
                  errors.bankCode ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white`}
                disabled={isLoadingBanks}
              >
                <span className="text-left">
                  {isLoadingBanks
                    ? "Loading banks..."
                    : selectedBank?.name || "Select a bank"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                ref={dropdownContentRef}
                className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[35dvh] overflow-hidden min-w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <div
                  className="p-2 border-b border-gray-200 sticky top-0 bg-white"
                  onMouseDown={handleSearchContainerMouseDown}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search banks..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={handleSearchInputFocus}
                      onBlur={handleSearchInputBlur}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[30dvh]">
                  {isLoadingBanks ? (
                    <div className="p-3 text-gray-500 text-center">
                      Loading banks...
                    </div>
                  ) : filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                      <DropdownMenu.Item
                        key={bank.id}
                        className="w-full text-left p-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer flex items-center data-[highlighted]:bg-gray-100"
                        onSelect={() => handleDropdownItemClick(bank.code)}
                      >
                        {bank.name}
                      </DropdownMenu.Item>
                    ))
                  ) : searchTerm.trim() ? (
                    <div className="p-3 text-gray-500 text-center">
                      No banks found matching "{searchTerm}"
                    </div>
                  ) : (
                    <div className="p-3 text-gray-500 text-center">
                      No banks available
                    </div>
                  )}
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {errors.bankCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bankCode.message}
            </p>
          )}
        </div>
      </div>

      <CustomButton
        type="submit"
        disabled={isLoading || isLoadingBanks}
        className={`w-full py-3 rounded-full text-white ${
          !isLoading && !isLoadingBanks
            ? "bg-positive-800 hover:bg-primary-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? "Adding... " : isLoadingBanks ? "Loading..." : "Add Bank"}
      </CustomButton>
    </form>
  );
};
