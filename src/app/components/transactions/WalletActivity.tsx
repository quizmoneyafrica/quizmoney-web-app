"use client";

import React from "react";
import FilterBar from "./FilterBar";
import ActivitySection from "./ActivitySection";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";
import { useWallet } from "@/app/store/walletSlice";
import { FlatTransaction, flattenTransactionsByDate } from "@/app/utils/utils";
import classNames from "classnames";
import { EmptyState } from "./EmptyState";

const PAGE_SIZE = 4;

export default function WalletActivity(): React.ReactElement {
  const [page, setPage] = React.useState(1);
  const { transactions, isTransactionsLoading } = useSelector(useWallet);

  const flatActivities: FlatTransaction[] =
    flattenTransactionsByDate(transactions);

  const pageCount = Math.ceil(flatActivities.length / PAGE_SIZE);
  const paginated = flatActivities.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const grouped: Record<string, FlatTransaction[]> = paginated.reduce(
    (acc, act) => {
      if (!acc[act.section]) acc[act.section] = [];
      acc[act.section].push(act);
      return acc;
    },
    {} as Record<string, FlatTransaction[]>
  );

  return (
    <div className="py-5">
      <FilterBar />
      <div
        className={classNames(
          transactions?.length === 0 && !isTransactionsLoading && "h-[70dvh]",
          "px-5 bg-white py-5 rounded-3xl"
        )}
      >
        {transactions?.length === 0 && !isTransactionsLoading && (
          <EmptyState
            description="You've not made any recent
 transactions yet "
          />
        )}
        {transactions?.length > 0 && (
          <>
            {Object.entries(grouped).map(([section, items]) => (
              <ActivitySection key={section} title={section} items={items} />
            ))}
          </>
        )}
      </div>
      {transactions?.length > 0 && (
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}
    </div>
  );
}
