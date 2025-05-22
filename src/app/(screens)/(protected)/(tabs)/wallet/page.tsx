"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import WalletLayout from "@/app/components/wallet/WalletLayout";
import {
  setWallet,
  setWalletLoading,
  setTransactionsLoading,
  setTransactions,
  setBanks,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { getAuthUser } from "@/app/api/userApi";

function Page() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        dispatch(setWalletLoading(true));
        const res = await WalletApi.fetchCustomerWallet();
        if (res.data.result.wallet) {
          dispatch(setWallet(res.data.result.wallet));
        }
      } catch (error) {
        console.log(error, "Wallet Error");
      } finally {
        dispatch(setWalletLoading(false));
      }
    };
    fetchWallet();

    // SET AUTH USER WALLET DATA
    const fetchTransactions = async () => {
      try {
        dispatch(setTransactionsLoading(true));
        const res = await WalletApi.fetchTransactions();

        if (res?.data?.result?.groupedTransactions) {
          dispatch(setTransactions(res?.data?.result?.groupedTransactions));
        }
      } catch (error) {
        console.log(error, "Transaction Error");
      } finally {
        dispatch(setTransactionsLoading(false));
      }
    };
    fetchTransactions();

    // SET LIST OF BANKS
    (async () => {
      try {
        const response = await WalletApi.listBanks();
        if (response.data.result?.data) {
          dispatch(setBanks(response.data.result?.data));
        }
      } catch (error) {
        console.log(error, "ERROR FETCHING BANKS");
      }
    })();
    (async () => {
      try {
        const { email } = getAuthUser();
        const response = await WalletApi.fetchDedicatedAccount({
          email,
        });
        if (response.data.result?.data) {
          console.log(
            "============fetchDedicatedAccount========================"
          );
          console.log(JSON.stringify(response.data, null, 2));
          console.log(
            "==========fetchDedicatedAccount=========================="
          );
        }
      } catch (error) {
        console.log(error, "ERROR FETCHING BANKS");
      }
    })();
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
