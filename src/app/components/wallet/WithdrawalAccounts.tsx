import { Trash2, Eye, EyeOff, Plus } from "lucide-react";
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
  useWallet,
} from "@/app/store/walletSlice";
import { store } from "@/app/store/store";

export default function WithdrawalAccounts() {
  interface Account extends BankAccount {
    id: number;
    hidden: boolean;
  }

  const { wallet } = useSelector(useWallet);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (wallet?.bankAccounts) {
      setAccounts(
        wallet.bankAccounts.map((account, index) => ({
          ...account,
          id: index + 1,
          hidden: true,
        }))
      );
    }
  }, [wallet]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleVisibility = (id: number): void => {
    setAccounts(
      accounts.map((account) =>
        account.id === id ? { ...account, hidden: !account.hidden } : account
      )
    );
  };

  const deleteAccount = (id: number): void => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };
  const { addBankAccountModal } = useSelector(useWallet);
  return (
    <div className="w-full bg-white p-4 rounded-3xl">
      <h1 className="text-xl font-bold mb-4">Withdrawal Accounts</h1>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
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
                  onClick={() => toggleVisibility(account.id)}
                  className="ml-2"
                >
                  {account.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="flex space-x-4">
                <button>
                  <CustomImage alt="edit icon" src="/icons/edit.svg" />
                </button>
                <button onClick={() => deleteAccount(account.id)}>
                  <Trash2 size={18} color="#ff0000" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold truncate">{account.accountName}</span>
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
        ))}

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

        <button
          onClick={() => store.dispatch(setAddBankModal(true))}
          className="border-2 border-dashed border-[#070707CC] rounded-full cursor-pointer py-4 w-full flex items-center justify-center space-x-2 hover:bg-gray-50"
        >
          <Plus size={20} />
          <span className="text-[#070707] text-base">Add new Bank</span>
        </button>
      </div>
    </div>
  );
}
