/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { useCallback, useEffect } from "react";
import WalletApi from "../wallet";
import { setTransactions, setWalletBalance } from "@/app/store/walletSlice";
import { liveQueryClient } from "@/app/api/parse/parseClient";
import Parse from "parse";
import { getAuthUser } from "../userApi";
import { updateCoinBalance } from "@/app/store/coinSlice";

function WalletQueries() {
  const dispatch = useAppDispatch();
  const user = getAuthUser();

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await WalletApi.fetchTransactions();

      if (res?.data?.result?.groupedTransactions) {
        dispatch(setTransactions(res?.data?.result?.groupedTransactions ?? []));
      }
    } catch (error) {
      return error && null;
    } finally {
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user?.objectId) return;
    let walletSubscription: any;
    let transactionSubscription: any;
    let coinSubscription: any;

    const coinLiveQuery = async () => {
      const query = new Parse.Query("Coin");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: user?.objectId,
      });
      coinSubscription = await liveQueryClient.subscribe(query);

      coinSubscription?.on("update", (coin: Parse.Object) => {
        console.log("UPDATED WALLET BALANCE", coin);
        const updatedBalance = coin.get("balance");
        dispatch(updateCoinBalance(updatedBalance));
      });
    };
    const walletLiveQuery = async () => {
      const query = new Parse.Query("Wallet");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: user?.objectId,
      });
      walletSubscription = await liveQueryClient.subscribe(query);

      walletSubscription?.on("update", (wallet: Parse.Object) => {
        const updatedBalance = wallet.get("balance");
        console.log("UPDATED WALLET BALANCE", updatedBalance);

        if (typeof updatedBalance === "string") {
          dispatch(setWalletBalance(updatedBalance));
        }
      });
    };
    const transactionLiveQuery = async () => {
      const query = new Parse.Query("UserWalletTransaction");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: user?.objectId,
      });
      transactionSubscription = await liveQueryClient.subscribe(query);

      transactionSubscription?.on("create", () => {
        fetchTransactions();
      });
      transactionSubscription?.on("update", () => {
        fetchTransactions();
      });
      transactionSubscription?.on("delete", () => {
        fetchTransactions();
      });
    };

    walletLiveQuery();
    transactionLiveQuery();
    coinLiveQuery();
    return () => {
      if (walletSubscription) walletSubscription.unsubscribe();
      if (transactionSubscription) transactionSubscription.unsubscribe();
      if (coinSubscription) coinSubscription.unsubscribe();
    };
  }, [dispatch, fetchTransactions, user?.objectId]);
  return null;
}

export default WalletQueries;
