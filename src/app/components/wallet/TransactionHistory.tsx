import React, { useEffect } from "react";
import WalletBalance from "./WalletBalance";
import CustomImage from "./CustomImage";
import classNames from "classnames";
import MobileList from "./MobileList";
import StoreAPI from "@/app/api/storeApi";

export interface Transaction {
  type: "deposit" | "withdrawal";
  amount: number;
  description: string;
  date: string;
}

export default function TransactionHistory() {
  const transactions: Transaction[] = [
    {
      type: "deposit",
      amount: 12000,
      description: "You just made a new Deposit",
      date: "Feb 12 09:00am",
    },
    {
      type: "withdrawal",
      amount: 12000,
      description: "You just made a new Withdrawal",
      date: "Feb 12 09:00am",
    },
  ];
  useEffect(() => {
    StoreAPI.fetchTransactions().then((res) => {
      console.log(
        JSON.stringify(res, null, 2),
        "=============TRANSACTIONS DATA======="
      );
    });
  }, []);
  return (
    <div className="w-full gap-4 md:gap-8 flex flex-col">
      <WalletBalance />

      <div className="md:bg-white bg-inherit rounded-2xl md:rounded-3xl">
        <div className="flex p-3 md:p-4 justify-between items-center my-2 md:my-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#2364AA]">
            Recent Transactions
          </h2>
          <button className="text-sm md:text-base text-[#2A75BC]">
            View all
          </button>
        </div>

        <div className="space-y-2 md:space-y-3 pb-3 md:pb-5">
          <div className="px-3 md:px-4">
            <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B]">
              Today
            </h2>
          </div>
          {transactions.map((transaction, index) => (
            <>
              <div
                key={index}
                className={classNames(
                  "bg-white px-3 md:px-4 py-3 md:py-4 hidden md:flex justify-between items-center ",
                  "border-b border-b-[#D9D9D9] "
                )}
              >
                <div className="flex gap-2 md:gap-4 items-center">
                  <div
                    className={`p-1.5 md:p-2 rounded-full ${
                      transaction.type === "deposit"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "deposit" ? (
                      <CustomImage
                        alt="arrow-up"
                        src="/icons/arrow-down-green.svg"
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    ) : (
                      <CustomImage
                        alt="arrow-up"
                        src="/icons/arrow-down-red.svg"
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-medium text-[#3B3B3B]">
                      {transaction.type === "deposit"
                        ? "Wallet Top up"
                        : "Withdrawal made"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {transaction.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm md:text-base font-medium ${
                      transaction.type === "deposit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "deposit" ? "+" : "-"} ₦
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {transaction.date}
                  </p>
                </div>
              </div>

              <MobileList transaction={transaction} />
            </>
          ))}
        </div>

        <div className="space-y-2 md:space-y-4 pb-3 md:pb-5 mt-3 md:mt-5">
          <div className="px-3 md:px-4">
            <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B]">
              Yesterday
            </h2>
          </div>
          {transactions.map((transaction, index) => (
            <>
              <div
                key={index}
                className={classNames(
                  "bg-white px-3 md:px-4 py-3 md:py-4 justify-between items-center hidden md:flex",
                  transactions.length - 1 !== index &&
                    "border-b border-b-[#D9D9D9]"
                )}
              >
                <div className="flex gap-2 md:gap-4 items-center">
                  <div
                    className={`p-1.5 md:p-2 rounded-full ${
                      transaction.type === "deposit"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "deposit" ? (
                      <CustomImage
                        alt="arrow-up"
                        src="/icons/arrow-down-green.svg"
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    ) : (
                      <CustomImage
                        alt="arrow-up"
                        src="/icons/arrow-down-red.svg"
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-medium text-[#3B3B3B]">
                      {transaction.type === "deposit"
                        ? "Wallet Top up"
                        : "Withdrawal made"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {transaction.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm md:text-base font-medium ${
                      transaction.type === "deposit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "deposit" ? "+" : "-"} ₦
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {transaction.date}
                  </p>
                </div>
              </div>

              <MobileList transaction={transaction} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
