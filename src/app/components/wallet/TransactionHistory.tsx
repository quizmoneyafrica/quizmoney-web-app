"use client";

import React, { useMemo, useState } from "react";
import WalletBalance from "./WalletBalance";
import MobileList from "./MobileList";
import { parseISO, isToday, isYesterday } from "date-fns";
import Link from "next/link";
import { renderEmptyState } from "../transactions/WalletActivity";
import { Skeleton } from "@radix-ui/themes";
import { TransactionDetailsModal } from "../transactions/TransactionDetailModal";
import { useWalletTransactions } from "@/lib/queries";
import { Transaction } from "@/app/api/wallet";

export interface TransactionGroup {
  today: Transaction[];
  yesterday: Transaction[];
  other: Transaction[];
}

export default function TransactionHistory(): React.JSX.Element {
  const { data, isLoading: isTransactionsLoading } = useWalletTransactions({
    page: 1,
    limit: 20,
  });
  console.log("Transactions", data);

  const transactions: Transaction[] = data?.transactions ?? [];

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const flattenedTransactions = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions],
  );

  const groupedTransactions: TransactionGroup = useMemo(() => {
    const group: TransactionGroup = { today: [], yesterday: [], other: [] };

    flattenedTransactions.forEach((transaction) => {
      const date = parseISO(transaction.created_at ?? new Date().toISOString());
      if (isToday(date)) {
        group.today.push(transaction);
      } else if (isYesterday(date)) {
        group.yesterday.push(transaction);
      } else {
        group.other.push(transaction);
      }
    });

    return group;
  }, [flattenedTransactions]);

  const limitedGroupedTransactions: TransactionGroup = useMemo(() => {
    const all = [
      ...groupedTransactions.today,
      ...groupedTransactions.yesterday,
      ...groupedTransactions.other,
    ];
    const limited = all.slice(0, 15);
    const group: TransactionGroup = { today: [], yesterday: [], other: [] };
    limited.forEach((transaction) => {
      const date = parseISO(transaction.created_at ?? new Date().toISOString());
      if (isToday(date)) {
        group.today.push(transaction);
      } else if (isYesterday(date)) {
        group.yesterday.push(transaction);
      } else {
        group.other.push(transaction);
      }
    });
    return group;
  }, [groupedTransactions]);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const renderTransaction = (
    transaction: Transaction,
    index: number,
    array: Transaction[],
  ): React.JSX.Element => {
    const isLastInGroup = index === array.length - 1;
    return (
      <div key={transaction.id || index.toString()}>
        <MobileList
          isLastInGroup={isLastInGroup}
          transaction={transaction as never}
          onClick={() => handleTransactionClick(transaction)}
        />
      </div>
    );
  };

  const renderTransactionSection = (
    title: string,
    txList: Transaction[],
  ): React.JSX.Element | null => {
    if (txList.length === 0) return null;
    return (
      <div className="space-y-2 md:space-y-3 pb-3 md:pb-5 mt-3 md:mt-5">
        <div className="px-3 md:px-4">
          <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B] text-left">
            {title}
          </h2>
        </div>
        {txList.map((transaction, index, array) =>
          renderTransaction(transaction, index, array),
        )}
      </div>
    );
  };

  return (
    <div className="w-full gap-4 md:gap-8 flex flex-col">
      <WalletBalance />

      <div className="md:bg-white bg-inherit rounded-2xl max-h-[60svh] overflow-auto md:rounded-3xl">
        <div className="flex p-3 md:p-4 justify-between items-center my-2 md:my-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#2364AA]">
            Recent Transactions
          </h2>
          <Link
            href="/wallet/transactions"
            className="text-sm md:text-base text-[#2A75BC]"
          >
            View all
          </Link>
        </div>

        {isTransactionsLoading ? (
          <div className="space-y-4 px-3 md:px-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 md:p-4 bg-white rounded-xl"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 md:w-48 rounded" />
                    <Skeleton className="h-3 w-24 md:w-32 rounded" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-20 md:w-28 rounded" />
                  <Skeleton className="h-3 w-16 md:w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : flattenedTransactions.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderTransactionSection(
              "Today",
              limitedGroupedTransactions.today,
            )}
            {renderTransactionSection(
              "Yesterday",
              limitedGroupedTransactions.yesterday,
            )}
            {renderTransactionSection(
              "Earlier",
              limitedGroupedTransactions.other,
            )}
          </>
        )}
      </div>

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction as never}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
