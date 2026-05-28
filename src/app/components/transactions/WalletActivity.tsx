"use client";
import React, { JSX, useState } from "react";
import { parseISO, isToday, isYesterday } from "date-fns";
import { Skeleton } from "@radix-ui/themes";

import FilterBar, { FilterType } from "./FilterBar";
import Pagination from "./Pagination";
import CustomImage from "../wallet/CustomImage";
import { ActivityRow } from "./ActivityRow";
import { useWalletTransactions } from "@/lib/queries";
import { Transaction } from "@/app/store/walletSlice";

// Map FilterType (status label) → actual status string used by the API
const STATUS_FILTER_MAP: Record<FilterType, string | null> = {
  [FilterType.ALL]: null,
  [FilterType.PENDING]: "pending",
  [FilterType.SUCCESSFUL]: "success", // API uses "success", not "successful"
  [FilterType.FAILED]: "failed",
};

interface WalletTransactionGroup {
  today: Transaction[];
  yesterday: Transaction[];
  other: Transaction[];
}

export function renderEmptyState(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-44 px-4 bg-white rounded-lg">
      <div>
        <CustomImage
          alt="empty-transactions"
          src="/icons/empty-state.svg"
          className="w-16 h-16 mb-4"
        />
      </div>
      <p className="text-gray-500 text-center text-sm md:text-base">
        {"You've not made any recent"} <br />
        transactions yet
      </p>
    </div>
  );
}

export default function WalletActivity(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.ALL,
  );

  // Always fetch all transactions — status filtering happens client-side
  // (the API only supports type filtering, not status filtering)
  const { data, isLoading } = useWalletTransactions({ page, limit: 20 });

  const allTransactions: Transaction[] = data?.transactions || [];

  // Client-side status filter
  const activeStatus = STATUS_FILTER_MAP[selectedFilter];
  const transactions = activeStatus
    ? allTransactions.filter((t) => t.status === activeStatus)
    : allTransactions;

  const totalPages = data?.pagination.total_pages || 1;

  const groupTransactions = (): WalletTransactionGroup => {
    const grouped: WalletTransactionGroup = {
      today: [],
      yesterday: [],
      other: [],
    };

    transactions.forEach((transaction) => {
      const date = parseISO(transaction.created_at ?? new Date().toISOString());

      if (isToday(date)) {
        grouped.today.push(transaction);
      } else if (isYesterday(date)) {
        grouped.yesterday.push(transaction);
      } else {
        grouped.other.push(transaction);
      }
    });

    return grouped;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchTransaction = (_query: string) => {
    // Search not yet supported by the API
  };

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    setPage(1); // Reset to first page when filter changes
  };

  const renderTransactionSection = (
    title: string,
    txs: Transaction[],
  ): JSX.Element | null => {
    if (txs.length === 0) return null;

    return (
      <div className="space-y-2 md:space-y-3 py-5 md:bg-white rounded-2xl mt-3 md:mt-5">
        <div className="px-3 md:px-4">
          <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B]">
            {title}
          </h2>
        </div>
        {txs.map((transaction, index) => (
          <ActivityRow
            isLast={txs.length === index + 1}
            transaction={transaction}
            key={transaction.id || index.toString()}
          />
        ))}
      </div>
    );
  };

  const groupedTransactions = groupTransactions();
  const hasTransactions = transactions.length > 0;

  return (
    <div className="py-5">
      <FilterBar
        searchTransaction={handleSearchTransaction}
        setSelectedFilter={handleFilterChange}
        selectedFilter={selectedFilter}
      />

      <div className="w-full gap-4 md:gap-8 flex flex-col">
        {isLoading ? (
          renderSkeletonLoader()
        ) : !hasTransactions ? (
          renderEmptyState()
        ) : (
          <>
            {renderTransactionSection("Today", groupedTransactions.today)}
            {renderTransactionSection("Yesterday", groupedTransactions.yesterday)}
            {renderTransactionSection("Earlier", groupedTransactions.other)}
          </>
        )}
      </div>

      {hasTransactions && (
        <Pagination
          page={page}
          pageCount={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

// Skeleton Loader
const renderSkeletonLoader = (): JSX.Element => (
  <div className="space-y-2 md:space-y-3 py-5 md:bg-white rounded-2xl mt-3 md:mt-5 px-3 md:px-4">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex justify-between items-center pb-3 mb-3">
        <div className="flex items-center gap-3">
          <Skeleton width="40px" height="40px" />
          <div className="space-y-1">
            <Skeleton width="112px" height="12px" />
            <Skeleton width="64px" height="12px" />
          </div>
        </div>
        <Skeleton width="64px" height="12px" />
      </div>
    ))}
  </div>
);
