"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { decryptData } from "@/app/utils/crypto";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import GameCard from "@/app/components/home/GameCard";
import TopGamers from "@/app/components/home/TopGamers";
import ReferBox from "@/app/components/home/ReferBox";
import { Grid } from "@radix-ui/themes";
import TransactionHistory from "@/app/components/wallet/TransactionHistory";
import {
  setTransactions,
  setTransactionsLoading,
  setWallet,
  setWalletLoading,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";

function HomeTab() {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user = encrypted ? decryptData(encrypted) : null;
  const dispatch = useAppDispatch();
  const { wallet, transactions } = useAppSelector((state) => state.wallet);
  useEffect(() => {
    const fetchWallet = async () => {
      if (wallet === undefined)
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
      if (transactions.length <= 0)
        try {
          dispatch(setTransactionsLoading(true));
          const res = await WalletApi.fetchTransactions();

          if (res?.data?.result?.groupedTransactions) {
            dispatch(
              setTransactions(res?.data?.result?.groupedTransactions ?? [])
            );
          }
        } catch (error) {
          console.log(error, "Transaction Error");
        } finally {
          dispatch(setTransactionsLoading(false));
        }
    };
    fetchTransactions();
  }, [dispatch, transactions, wallet]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Grid columns={{ initial: "1", lg: "2" }} gap="4">
          <div>
            <Grid gap="4">
              <GameCard />
              <TopGamers />
              <ReferBox refCode={user?.referralCode} />
            </Grid>
          </div>
          <div className="bg-white rounded-[20px] hidden lg:inline-block p-4">
            <TransactionHistory />
          </div>
        </Grid>
      </motion.div>
    </>
  );
}

export default HomeTab;
