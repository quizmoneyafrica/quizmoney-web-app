import { PenLine, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";
import CustomImage from "./CustomImage";

export default function WithdrawalAccounts() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      accountNumber: "15********7",
      name: "JOSEPH MICHEAL.O",
      bank: "Access Bank",
      hidden: true,
    },
    {
      id: 2,
      accountNumber: "15********7",
      name: "JOSEPH MICHEAL.O",
      bank: "Access Bank",
      hidden: true,
    },
  ]);

  interface Account {
    id: number;
    accountNumber: string;
    name: string;
    bank: string;
    hidden: boolean;
  }

  const toggleVisibility = (id: number): void => {
    setAccounts(
      accounts.map((account: Account) =>
        account.id === id ? { ...account, hidden: !account.hidden } : account
      )
    );
  };

  const deleteAccount = (id: number): void => {
    setAccounts(accounts.filter((account: Account) => account.id !== id));
  };

  return (
    <div className=" w-full bg-white p-4 rounded-3xl">
      <h1 className="text-xl font-bold mb-4">Withdrawal Accounts</h1>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-[#F4F4F4] border border-[#0000001A] py-5 px-4 rounded-3xl"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <span className="font-medium">{account.accountNumber}</span>
                <button
                  onClick={() => toggleVisibility(account.id)}
                  className="ml-2"
                >
                  {account.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="flex space-x-4">
                <button>
                  <CustomImage alt="edit icon" src={"/icons/edit.svg"} />
                </button>
                <button onClick={() => deleteAccount(account.id)}>
                  <Trash2 size={18} color="#ff0000" />
                </button>
              </div>
            </div>

            <div className="flex justify-between  items-center">
              <span className="font-bold truncate">{account.name}</span>
              <div className="flex items-center">
                <CustomImage
                  alt="access-logo"
                  className=" md:block hidden"
                  src={"/icons/access-logo.svg"}
                />
                <span className="text-gray-700 md:text-sm text-xs">
                  {account.bank}
                </span>
              </div>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-[#070707CC] rounded-full cursor-pointer py-4 w-full flex items-center justify-center space-x-2 hover:bg-gray-50">
          <Plus size={20} />
          <span className=" tex-[#070707] text-base">Add new Bank</span>
        </button>
      </div>
    </div>
  );
}
