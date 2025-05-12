"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import WalletLayout from "@/app/components/wallet/WalletLayout";
import {
  setWallet,
  setWalletLoading,
  setTransactionsLoading,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";
import { useAppDispatch } from "@/app/hooks/useAuth";

function Page() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        dispatch(setWalletLoading(true));
        const res = await WalletApi.fetchCustomerWallet();
        dispatch(setWallet(res.data.result.wallet));
      } catch (error) {
        console.log(error, "Wallet Error");
      } finally {
        dispatch(setWalletLoading(false));
      }
    };
    fetchWallet();
  }, [dispatch]);
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        dispatch(setWalletLoading(true));
        const res = await WalletApi.fetchTransactions();
        console.log("====================================");
        console.log(res?.data);
        if (res?.data?.result !== "No transactions found for this user") {
        } else {
        }
        console.log("====================================");
        // dispatch(setWallet(res.data.result.wallet));
      } catch (error) {
        console.log(error, "Wallet Error");
      } finally {
        dispatch(setTransactionsLoading(false));
      }
    };
    fetchWallet();
  }, [dispatch]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <WalletLayout />
    </motion.div>
  );
}

export default Page;
