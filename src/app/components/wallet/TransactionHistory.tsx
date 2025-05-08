import React from "react";
import WalletBalance from "./WalletBalance";
import CustomImage from "./CustomImage";

interface Transaction {
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

  return (
    <div className=" w-full gap-5 flex flex-col">
      <WalletBalance />

      <div className="p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2364AA]">
            Recent Transactions
          </h2>
          <button className="text-[#2A75BC]">View all</button>
        </div>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "deposit"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "deposit" ? (
                    <CustomImage
                      alt="arrow-up"
                      src={"/icons/arrow-down-green.svg"}
                    />
                  ) : (
                    <CustomImage
                      alt="arrow-up"
                      src={"/icons/arrow-down-red.svg"}
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#3B3B3B]">
                    {transaction.type === "deposit"
                      ? "Wallet Top up"
                      : "Withdrawal made"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    transaction.type === "deposit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "deposit" ? "+" : "-"} ₦
                  {transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
