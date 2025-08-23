import { Plus, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { setAddBankModal, useWallet } from "@/app/store/walletSlice";
import { useState } from "react";

import { store } from "@/app/store/store";
import QmDrawer from "../drawer/drawer";
import { MobileAddBankAccount } from "./MobileAddBankAccount";

export default function WithdrawalAccounts() {
  const { payoutBanks } = useSelector(useWallet);
  const { addBankAccountModal } = useSelector(useWallet);
  const [isAccountNumberMasked, setIsAccountNumberMasked] = useState(true);
  const [isBankCodeMasked, setIsBankCodeMasked] = useState(true);

  const toggleAccountNumberVisibility = () => {
    setIsAccountNumberMasked(!isAccountNumberMasked);
  };

  const toggleBankCodeVisibility = () => {
    setIsBankCodeMasked(!isBankCodeMasked);
  };

  const getMaskedAccountNumber = (accountNumber: string) => {
    if (!isAccountNumberMasked) return accountNumber;
    const firstTwo = accountNumber.slice(0, 2);
    const lastTwo = accountNumber.slice(-2);
    const middleStars = "*".repeat(accountNumber.length - 4);
    return `${firstTwo}${middleStars}${lastTwo}`;
  };

  const getMaskedBankCode = (bankCode: string) => {
    if (!isBankCodeMasked) return bankCode;
    return "*".repeat(bankCode.length);
  };

  return (
    <>
      <div className="w-full bg-white p-4 rounded-3xl hidden md:block">
        <h1 className="text-xl font-bold mb-4">Payout Accounts</h1>

        <div className="space-y-4">
          {payoutBanks && (
            <div className="bg-[#F4F4F4] border border-[#0000001A] py-5 px-4 rounded-3xl">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">
                    Account Number:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">
                      {getMaskedAccountNumber(payoutBanks.accountNumber)}
                    </span>
                    <button
                      onClick={toggleAccountNumberVisibility}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isAccountNumberMasked ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Bank Name:</span>
                  <span className="font-bold">{payoutBanks.bankName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">
                    Account Name:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold capitalize">
                      {getMaskedBankCode(payoutBanks.accountName)}
                    </span>
                    <button
                      onClick={toggleBankCodeVisibility}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isBankCodeMasked ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!payoutBanks && (
            <button
              onClick={() => {
                store.dispatch(setAddBankModal(true));
              }}
              className="border-2 border-dashed border-[#070707CC] rounded-full cursor-pointer py-4 w-full flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <Plus size={20} />
              <span className="text-[#070707] text-base">Add new Bank</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Bank Account Modal */}
      <QmDrawer
        open={addBankAccountModal}
        onOpenChange={(val) => store.dispatch(setAddBankModal(val))}
        title="Add Bank account"
        titleLeft
        heightClass="h-[75%] md:h-[65%] lg:h-[85%]"
      >
        <MobileAddBankAccount
          close={() => store.dispatch(setAddBankModal(false))}
        />
      </QmDrawer>
    </>
  );
}
