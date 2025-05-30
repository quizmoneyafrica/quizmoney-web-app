"use client";
import React, { useMemo } from "react";
import WalletBalance from "./WalletBalance";
import CustomImage from "./CustomImage";
import classNames from "classnames";
import MobileList from "./MobileList";
import { useSelector } from "react-redux";
import {
  // setBanks,
  // setTransactions,
  // setWallet,
  useWallet,
} from "@/app/store/walletSlice";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import Link from "next/link";
import { renderEmptyState } from "../transactions/WalletActivity";
import { Skeleton } from "@radix-ui/themes";
import { formatNaira } from "@/app/utils/utils";
// import { useAppDispatch } from "@/app/hooks/useAuth";
// import WalletApi from "@/app/api/wallet";
// import { getAuthUser } from "@/app/api/userApi";
// import Parse from "parse";
// import { liveQueryClient } from "@/app/api/parse/parseClient";

interface Transaction {
  amount: number;
  title: string;
  description: string;
  type: string;
  status: string;
  user: {
    __type: string;
    className: string;
    objectId: string;
  };
  createdAt: string;
  updatedAt: string;
  objectId: string;
  __type: string;
  className: string;
}

export type UserWalletTransaction = {
  date: string;
  transactions: Array<Transaction>;
};

export interface TransactionGroup {
  today: Transaction[];
  yesterday: Transaction[];
  other: Transaction[];
}

export default function TransactionHistory(): React.JSX.Element {
  const { transactions, isTransactionsLoading } = useSelector(useWallet);
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   let subscription: any;
  //   const setupWalletLiveQuery = async () => {
  //     const user = getAuthUser();
  //     if (!user?.objectId) return;

  //     const Wallet = Parse.Object.extend("Wallet");
  //     const query = new Parse.Query(Wallet);
  //     query.equalTo("user", {
  //       __type: "Pointer",
  //       className: "_User",
  //       objectId: user.objectId,
  //     });

  //     subscription = await liveQueryClient.subscribe(query);

  //     subscription.on("update", (walletObj: Parse.Object) => {
  //       console.log("Wallet updated in real time:", walletObj.toJSON());
  //       // dispatch(setWallet(walletObj.toJSON()));
  //     });

  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     subscription.on("error", (err: any) => {
  //       console.error("Wallet LiveQuery error:", err);
  //     });
  //   };

  //   setupWalletLiveQuery();

  //   return () => {
  //     if (subscription) subscription.unsubscribe();
  //   };
  // }, [dispatch]);

  // useEffect(() => {
  //   const fetchWallet = async () => {
  //     try {
  //       const res = await WalletApi.fetchCustomerWallet();
  //       if (res.data.result.wallet) {
  //         dispatch(setWallet(res.data.result.wallet));
  //       }
  //     } catch (error) {
  //       console.log(error, "Wallet Error");
  //     }
  //   };
  //   fetchWallet();

  //   // SET AUTH USER WALLET DATA
  //   const fetchTransactions = async () => {
  //     try {
  //       const res = await WalletApi.fetchTransactions();

  //       if (res?.data?.result?.groupedTransactions) {
  //         dispatch(setTransactions(res?.data?.result?.groupedTransactions));
  //       }
  //     } catch (error) {
  //       console.log(error, "Transaction Error");
  //     }
  //   };
  //   fetchTransactions();

  //   // SET LIST OF BANKS
  //   (async () => {
  //     try {
  //       const response = await WalletApi.listBanks();
  //       if (response.data.result?.data) {
  //         dispatch(setBanks(response.data.result?.data));
  //       }
  //     } catch (error) {
  //       console.log(error, "ERROR FETCHING BANKS");
  //     }
  //   })();
  //   (async () => {
  //     try {
  //       const { email } = getAuthUser();
  //       const response = await WalletApi.fetchDedicatedAccount({
  //         email,
  //       });
  //       if (response.data.result?.data) {
  //         console.log(
  //           "============fetchDedicatedAccount========================"
  //         );
  //         console.log(JSON.stringify(response.data, null, 2));
  //         console.log(
  //           "==========fetchDedicatedAccount=========================="
  //         );
  //       }
  //     } catch (error) {
  //       console.log(error, "ERROR FETCHING BANKS");
  //     }
  //   })();
  // }, [dispatch]);

  const flattenedTransactions = useMemo(
    () => transactions.flatMap((walletTx) => walletTx.transactions),
    [transactions]
  );

  const groupedTransactions: TransactionGroup = useMemo(() => {
    const group: TransactionGroup = {
      today: [],
      yesterday: [],
      other: [],
    };

    flattenedTransactions.forEach((transaction: Transaction) => {
      const date = parseISO(transaction?.createdAt ?? new Date().toISOString());

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

  const renderTransaction = (
    transaction: Transaction,
    index: number,
    array: Transaction[]
  ): React.JSX.Element => {
    const date = parseISO(transaction.createdAt ?? new Date().toISOString());
    const dateData = format(date, "MMM d h:mma").toLowerCase();
    const isLastInGroup = index === array.length - 1;

    return (
      <div key={transaction.objectId || index.toString()}>
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
              <CustomImage
                alt="arrow-icon"
                src={
                  transaction.type === "deposit"
                    ? "/icons/arrow-down-green.svg"
                    : "/icons/arrow-down-red.svg"
                }
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm md:text-base font-medium text-[#3B3B3B]">
                {transaction.title ||
                  (transaction.type === "deposit"
                    ? "Wallet Top up"
                    : "Withdrawal made")}
              </span>
              <span className="text-xs md:text-sm text-gray-500">
                {transaction.type}
              </span>
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
              {transaction.type === "deposit" ? "+ " : "- "}
              {/* {transaction.amount.toLocaleString()} */}
              {formatNaira(Number(transaction.amount ?? 0), true)}
            </p>
            <p className="text-xs md:text-sm text-gray-500">{dateData}</p>
          </div>
        </div>
        <MobileList transaction={transaction} />
      </div>
    );
  };

  const renderTransactionSection = (
    title: string,
    transactions: Transaction[]
  ): React.JSX.Element | null => {
    if (transactions.length === 0) return null;
    // return (
    //   <div className="space-y-2 md:space-y-3 pb-3 md:pb-5 mt-3 md:mt-5">
    //     <div className="px-3 md:px-4">
    //       <h2 className="text-sm md:text-base font-semibold text-[#3B3B3B]">
    //         {title}
    //       </h2>
    //     </div>
    //     <div className="px-3 md:px-4 py-3 md:py-4 flex justify-center items-center">
    //       <p className="text-sm text-gray-500">No transactions</p>
    //     </div>
    //   </div>
    // );

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
          <Link
            href={"/wallet/transactions"}
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
            {renderTransactionSection("Today", groupedTransactions.today)}
            {renderTransactionSection(
              "Yesterday",
              groupedTransactions.yesterday
            )}
          </>
        )}
      </div>
    </div>
  );
}
