"use client";
import React, { JSX, useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransactions,
  setTransactionsLoading,
  Transaction,
  useWallet,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";
import {
  TransactionGroup,
  UserWalletTransaction,
} from "../wallet/TransactionHistory";
import { parseISO, isToday, isYesterday } from "date-fns";
import CustomImage from "../wallet/CustomImage";
import { ActivityRow } from "./ActivityRow";

const PAGE_SIZE = 15;

export default function WalletActivity(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const { transactions, isTransactionsLoading } = useSelector(useWallet);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        dispatch(setTransactionsLoading(true));
        const res = await WalletApi.fetchTransactions({
          page,
          limit: PAGE_SIZE,
        });

        const data = res?.data?.result;
        if (data?.groupedTransactions) {
          dispatch(setTransactions(data?.groupedTransactions));
          setTotalPages(data?.totalPages || 1);
        } else {
          dispatch(setTransactions([]));
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Transaction Error:", error);
        dispatch(setTransactions([]));
        setTotalPages(1);
      } finally {
        dispatch(setTransactionsLoading(false));
      }
    };
    fetchTransactions();
  }, [page, dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const groupedTransactions: TransactionGroup = {
    today: [],
    yesterday: [],
    other: [],
  };

  const flattenedTransactions: Transaction[] = [];
  transactions.forEach((walletTransaction: UserWalletTransaction) => {
    walletTransaction.transactions.forEach((transaction: Transaction) => {
      flattenedTransactions.push(transaction);
    });
  });

  flattenedTransactions.forEach((transaction: Transaction) => {
    const date = parseISO(transaction?.createdAt ?? new Date().toISOString());
    if (isToday(date)) {
      groupedTransactions.today.push(transaction);
    } else if (isYesterday(date)) {
      groupedTransactions.yesterday.push(transaction);
    } else {
      groupedTransactions.other.push(transaction);
    }
  });

  const renderTransactionSection = (
    title: string,
    transactions: Transaction[]
  ): JSX.Element | null => {
    if (transactions.length === 0) return null;

    return (
      <div className="space-y-2 md:space-y-3 py-5 bg-white rounded-2xl mt-3 md:mt-5">
        <div className="px-3 md:px-4">
          <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B]">
            {title}
          </h2>
        </div>
        {transactions.map((transaction, index) => (
          <ActivityRow
            transaction={transaction}
            key={transaction.objectId || index.toString()}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-5">
      <FilterBar />
      <div className="w-full gap-4 md:gap-8 flex flex-col">
        {isTransactionsLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2364AA]"></div>
          </div>
        ) : flattenedTransactions.length === 0 ? (
          renderEmptyState()
        ) : (
          <React.Fragment>
            {renderTransactionSection("Today", groupedTransactions.today)}
            {renderTransactionSection(
              "Yesterday",
              groupedTransactions.yesterday
            )}
            {renderTransactionSection("Earlier", groupedTransactions.other)}
          </React.Fragment>
        )}
      </div>
      {transactions?.length > 0 && (
        <Pagination
          page={page}
          pageCount={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export const renderEmptyState = (): JSX.Element => (
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
