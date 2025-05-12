import React, { JSX } from "react";
import WalletBalance from "./WalletBalance";
import CustomImage from "./CustomImage";
import classNames from "classnames";
import MobileList from "./MobileList";
import { useSelector } from "react-redux";
import { UserWalletTransaction, useWallet } from "@/app/store/walletSlice";
import { format, parseISO, isToday, isYesterday } from "date-fns";

interface TransactionGroup {
  today: UserWalletTransaction[];
  yesterday: UserWalletTransaction[];
  other: UserWalletTransaction[];
}

export default function TransactionHistory(): JSX.Element {
  const { transactions, isTransactionsLoading } = useSelector(useWallet);

  const groupedTransactions: TransactionGroup = {
    today: [],
    yesterday: [],
    other: [],
  };

  transactions.forEach((transaction: UserWalletTransaction) => {
    const date = parseISO(transaction?.createdAt ?? new Date().toISOString());

    if (isToday(date)) {
      groupedTransactions.today.push(transaction);
    } else if (isYesterday(date)) {
      groupedTransactions.yesterday.push(transaction);
    } else {
      groupedTransactions.other.push(transaction);
    }
  });

  // Render a single transaction item
  const renderTransaction = (
    transaction: UserWalletTransaction,
    index: number,
    array: UserWalletTransaction[]
  ): JSX.Element => {
    const date = parseISO(transaction?.createdAt ?? new Date().toISOString());
    const dateData = format(date, "MMM d h:mma").toLowerCase();
    const isLastInGroup = index === array.length - 1;

    return (
      <React.Fragment key={index.toString()}>
        <div
          className={classNames(
            "bg-white px-3 md:px-4 py-3 md:py-4 hidden md:flex justify-between items-center",
            !isLastInGroup && "border-b border-b-[#D9D9D9]"
          )}
        >
          <div className="flex gap-2 md:gap-4 items-center">
            <div
              className={`p-1.5 md:p-2 rounded-full ${
                transaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
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
                {transaction.type}
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
            <p className="text-xs md:text-sm text-gray-500">{dateData}</p>
          </div>
        </div>

        <MobileList transaction={transaction} />
      </React.Fragment>
    );
  };

  const renderEmptyState = (): JSX.Element => (
    <div className="flex flex-col items-center justify-center py-44 px-4 bg-white rounded-lg">
      <CustomImage
        alt="empty-transactions"
        src="/icons/empty-state.svg"
        className="w-16 h-16 mb-4"
      />
      <p className="text-gray-500 text-center text-sm md:text-base">
        {"You've not made any recent"} <br />
        transactions yet
      </p>
    </div>
  );

  const renderTransactionSection = (
    title: string,
    transactions: UserWalletTransaction[]
  ): JSX.Element | null => {
    if (transactions.length === 0) return null;

    return (
      <div className="space-y-2 md:space-y-3 pb-3 md:pb-5 mt-3 md:mt-5">
        <div className="px-3 md:px-4">
          <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B]">
            {title}
          </h2>
        </div>

        {transactions.map((transaction, index, array) =>
          renderTransaction(transaction, index, array)
        )}
      </div>
    );
  };

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

        {isTransactionsLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2364AA]"></div>
          </div>
        ) : transactions.length === 0 ? (
          renderEmptyState()
        ) : (
          <React.Fragment>
            {renderTransactionSection("Today", groupedTransactions.today)}
            {renderTransactionSection(
              "Yesterday",
              groupedTransactions.yesterday
            )}
            {/* {renderTransactionSection("Earlier", groupedTransactions.other)} */}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
