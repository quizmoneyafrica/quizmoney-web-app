"use client";
import React, { JSX, useEffect, useState } from "react";
import { parseISO, isToday, isYesterday } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@radix-ui/themes";

import FilterBar, { FilterType } from "./FilterBar";
import Pagination from "./Pagination";
import CustomImage from "../wallet/CustomImage";
import { ActivityRow } from "./ActivityRow";
import {
  setTransactions,
  setTransactionsLoading,
  useWallet,
  Transaction,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";

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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.PENDING
  );

  const dispatch = useDispatch();
  const { transactions, isTransactionsLoading } = useSelector(useWallet);

  const fetchTransactions = async (
    params: {
      searchText?: string;
      transactionStatus?: FilterType;
    } = {}
  ) => {
    try {
      let res;
      if (Object.keys(params).length > 0) {
        res = await WalletApi.fetchTransactions({ page, ...params });
      } else {
        res = await WalletApi.fetchTransactions({ page });
      }
      dispatch(setTransactionsLoading(true));
      console.log(
        JSON.stringify(res, null, 2),
        "=============list of transactions from api======="
      );

      if (res?.success && res?.data) {
        dispatch(setTransactions(res.data.content || []));
        setTotalPages(res.data.totalPages || 1);
        console.log("Transactions fetched:", res.data.content?.length || 0);
      } else {
        dispatch(setTransactions([]));
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);

      dispatch(setTransactions([]));
      setTotalPages(1);
    } finally {
      dispatch(setTransactionsLoading(false));
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const groupTransactions = (): WalletTransactionGroup => {
    const grouped: WalletTransactionGroup = {
      today: [],
      yesterday: [],
      other: [],
    };

    (transactions || []).forEach((transaction: Transaction) => {
      const date = parseISO(
        transaction?.transactionDate ?? new Date().toISOString()
      );
      // Debug: log grouping
      console.log("Grouping transaction:", transaction, "Parsed date:", date);
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

  const handleSearchTransaction = async (query: string) => {
    setPage(0); // Reset to first page when searching
    await fetchTransactions({ searchText: query });
  };

  const handleFilterChange = async (filter: FilterType) => {
    setPage(0); // Reset to first page when filtering
    setSelectedFilter(filter);
    await fetchTransactions({ transactionStatus: filter });
  };

  const renderTransactionSection = (
    title: string,
    transactions: Transaction[]
  ): JSX.Element | null => {
    if (transactions.length === 0) return null;

    return (
      <div className="space-y-2 md:space-y-3 py-5 md:bg-white rounded-2xl mt-3 md:mt-5">
        <div className="px-3 md:px-4">
          <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B]">
            {title}
          </h2>
        </div>
        {transactions.map((transaction, index) => (
          <ActivityRow
            isLast={transactions.length === index + 1}
            transaction={transaction}
            key={transaction.id || index.toString()}
          />
        ))}
      </div>
    );
  };

  const renderSkeletonLoader = (): JSX.Element => (
    <div className="space-y-2 md:space-y-3 py-5 md:bg-white rounded-2xl mt-3 md:mt-5 px-3 md:px-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center pb-3 mb-3"
        >
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

  const groupedTransactions = groupTransactions();
  const hasTransactions = (transactions || []).length > 0;

  return (
    <div className="py-5">
      <FilterBar
        searchTransaction={handleSearchTransaction}
        setSelectedFilter={handleFilterChange}
        selectedFilter={selectedFilter}
      />

      <div className="w-full gap-4 md:gap-8 flex flex-col">
        {isTransactionsLoading ? (
          renderSkeletonLoader()
        ) : !hasTransactions ? (
          renderEmptyState()
        ) : (
          <>
            {renderTransactionSection("Today", groupedTransactions.today)}
            {renderTransactionSection(
              "Yesterday",
              groupedTransactions.yesterday
            )}
            {/* Always render 'Earlier' if any transaction exists */}
            {(groupedTransactions.other.length > 0 || hasTransactions) &&
              renderTransactionSection("Earlier", groupedTransactions.other)}
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
