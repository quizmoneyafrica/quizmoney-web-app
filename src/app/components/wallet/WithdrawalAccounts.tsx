import { Trash2, Eye, EyeOff, Plus, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import CustomImage from "./CustomImage";
import * as Dialog from "@radix-ui/react-dialog";
import AddBankModal from "./AddBankModal";
import { BottomSheet } from "./BottomSheet";
import { MobileAddBankAccount } from "./MobileAddBankAccount";
import { useSelector } from "react-redux";
import {
  BankAccount,
  setAddBankModal,
  setWallet,
  setWalletLoading,
  useWallet,
} from "@/app/store/walletSlice";
import { v4 as uuidv4 } from "uuid";

import { store } from "@/app/store/store";
import { toast } from "sonner";
import WalletApi from "@/app/api/wallet";
import { toastPosition } from "@/app/utils/utils";

export default function WithdrawalAccounts() {
  interface Account extends BankAccount {
    id: number;
    uniqueId: string;
    hidden: boolean;
  }

  const { wallet } = useSelector(useWallet);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (wallet?.bankAccounts) {
      setAccounts(
        wallet.bankAccounts.map((account, index) => ({
          ...account,
          id: index + 1,
          uniqueId: uuidv4(),
          hidden: true,
        }))
      );
    }
  }, [wallet?.bankAccounts]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleVisibility = (id: string): void => {
    setAccounts(
      accounts.map((account) =>
        account.uniqueId === id
          ? { ...account, hidden: !account.hidden }
          : account
      )
    );
  };

  const deleteAccount = async (account: Account) => {
    try {
      setIsDeleting(true);
      setDeleteId(account.uniqueId);

      const response = await WalletApi.removeBankAccount({
        bankAccount: {
          accountNumber: account.accountNumber,
          bankName: account.bankName,
          accountName: account.accountName,
        },
      });

      if (response?.data?.result) {
        fetchWallet();
        setAccounts(
          accounts.filter((acc) => acc.uniqueId !== account.uniqueId)
        );
        toast.success(
          response?.data?.result.message || "Bank account deleted successfully",
          {
            position: toastPosition,
          }
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to delete bank account",
        {
          position: toastPosition,
        }
      );
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const { addBankAccountModal } = useSelector(useWallet);

  const fetchWallet = async () => {
    try {
      store.dispatch(setWalletLoading(true));
      const res = await WalletApi.fetchCustomerWallet();
      if (res.data.result.wallet) {
        store.dispatch(setWallet(res.data.result.wallet));
      }
    } catch (error) {
      console.log(error, "Wallet Error");
    } finally {
      store.dispatch(setWalletLoading(false));
    }
  };

  return (
    <>
      <div className="w-full bg-white p-4 rounded-3xl hidden md:block">
        <h1 className="text-xl font-bold mb-4">Withdrawal Accounts</h1>

        <div className="space-y-4 ">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div
                key={account.uniqueId}
                className="bg-[#F4F4F4] border border-[#0000001A] py-5 px-4 rounded-3xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {account.hidden
                        ? `${account.accountNumber.slice(
                            0,
                            2
                          )}********${account.accountNumber.slice(-1)}`
                        : account.accountNumber}
                    </span>
                    <button
                      onClick={() => toggleVisibility(account.uniqueId)}
                      className="ml-2"
                    >
                      {account.hidden ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      className="cursor-pointer"
                      disabled={isDeleting && deleteId === account.uniqueId}
                      onClick={() => deleteAccount(account)}
                    >
                      {isDeleting && deleteId === account.uniqueId ? (
                        <Loader className="animate-spin size-5 text-red-500" />
                      ) : (
                        <Trash2 size={18} color="#ff0000" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold truncate">
                    {account.accountName}
                  </span>
                  <div className="flex items-center">
                    <CustomImage
                      alt="access-logo"
                      className="md:block hidden"
                      src="/icons/access-logo.svg"
                    />
                    <span className="text-gray-700 md:text-sm text-xs">
                      {account.bankName}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No bank accounts added yet
            </div>
          )}

          <button
            onClick={() => {
              if (wallet?.bankAccounts && wallet?.bankAccounts.length >= 3) {
                toast.info("You've already have three account number listed", {
                  position: toastPosition,
                });
                return;
              }
              store.dispatch(setAddBankModal(true));
            }}
            className="border-2 border-dashed border-[#070707CC] rounded-full cursor-pointer py-4 w-full flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <Plus size={20} />
            <span className="text-[#070707] text-base">Add new Bank</span>
          </button>
        </div>
      </div>

      {isMobile ? (
        <BottomSheet
          isOpen={addBankAccountModal}
          onClose={() => store.dispatch(setAddBankModal(false))}
          title="Add Bank account"
        >
          <MobileAddBankAccount
            close={() => store.dispatch(setAddBankModal(false))}
          />
        </BottomSheet>
      ) : (
        <Dialog.Root
          open={addBankAccountModal}
          onOpenChange={(data) => {
            store.dispatch(setAddBankModal(data));
          }}
        >
          <AddBankModal
            open={addBankAccountModal}
            onOpenChange={(g) => store.dispatch(setAddBankModal(g))}
          />
        </Dialog.Root>
      )}
    </>
  );
}
