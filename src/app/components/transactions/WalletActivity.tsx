"use client";

import React, { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import ActivitySection from "./ActivitySection";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransactions,
  setTransactionsLoading,
  useWallet,
} from "@/app/store/walletSlice";
import { FlatTransaction, flattenTransactionsByDate } from "@/app/utils/utils";
import classNames from "classnames";
import { EmptyState } from "./EmptyState";
import WalletApi from "@/app/api/wallet";

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

        const data = res?.data;
        if (data?.groupedTransactions) {
          dispatch(setTransactions(data.groupedTransactions));
          setTotalPages(data.totalPages || 1);
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

  const flatActivities: FlatTransaction[] =
    flattenTransactionsByDate(transactions);
  const grouped: Record<string, FlatTransaction[]> = flatActivities.reduce(
    (acc, act) => {
      if (!acc[act.section]) acc[act.section] = [];
      acc[act.section].push(act);
      return acc;
    },
    {} as Record<string, FlatTransaction[]>
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="py-5">
      <FilterBar />
      <div
        className={classNames(
          (transactions?.length === 0 || isTransactionsLoading) && "h-[70dvh]",
          "px-5 bg-white py-5 rounded-3xl"
        )}
      >
        {isTransactionsLoading ? (
          <div className=" items-center flex flex-row justify-center h-full  w-full py-8 ">
            <div className=" animate-spin size-8 rounded-full border-b-2 border-b-primary-900" />
          </div>
        ) : transactions?.length === 0 ? (
          <EmptyState description="You've not made any recent transactions yet" />
        ) : (
          Object.entries(grouped).map(([section, items]) => (
            <ActivitySection key={section} title={section} items={items} />
          ))
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
