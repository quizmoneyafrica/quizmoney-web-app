"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import React, { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import GameCard from "@/app/components/home/GameCard";
import TopGamers from "@/app/components/home/TopGamers";
import { Grid } from "@radix-ui/themes";
import TransactionHistory from "@/app/components/wallet/TransactionHistory";
import {
  setTransactions,
  setTransactionsLoading,
  setWallet,
  setWalletLoading,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";
import AdBanner from "@/app/components/advert/adBanner";
import KycStart from "@/app/components/kyc/kyc-start";
import KycContinue from "@/app/components/kyc/kyc-continue";
import GameZoneCardTemp, {
  GameZoneCardObject,
} from "@/app/components/home/(game-zone)/temp/GameZoneCardTemp";
import { GameZoneTitle } from "@/app/icons/icons";
import { useRouter } from "next/navigation";

function HomeTab() {
  const { customerKyc } = useAppSelector((s) => s.kyc);
  const phoneStep = customerKyc.find((s) => s.step === "PHONE");
  const bvnStep = customerKyc.find((s) => s.step === "BVN");

  const dispatch = useAppDispatch();
  const { wallet: walletData, transactions } = useAppSelector(
    (state) => state.wallet
  );
  const wallet = walletData.find((w) => w.currency === "NGN")! || {};
  const router = useRouter();
  console.log(wallet);

  const fetchWallet = useCallback(async () => {
    // if (wallet === undefined)
    try {
      dispatch(setWalletLoading(true));
      const res = await WalletApi.fetchCustomerWallet();
      if (res?.data) {
        dispatch(setWallet(res?.data));
      }
    } catch (error) {
      console.log(error, "Wallet Error");
    } finally {
      dispatch(setWalletLoading(false));
    }
  }, [dispatch]);

  // SET AUTH USER WALLET DATA
  const fetchTransactions = useCallback(async () => {
    if (transactions.length <= 0)
      try {
        dispatch(setTransactionsLoading(true));
        const res = await WalletApi.fetchTransactions();
        if (res?.data?.content) {
          dispatch(setTransactions(res?.data.content ?? []));
        }
      } catch (error) {
        console.log(error, "Transaction Error");
      } finally {
        dispatch(setTransactionsLoading(false));
      }
  }, [dispatch, transactions.length]);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchTransactions, fetchWallet]);

  const gameZoneData: GameZoneCardObject = {
    title: <GameZoneTitle />,
    description: "Play games daily & win cash instantly",
    src: "/assets/images/game-zone.png",
    onClick: () => router.push("/game-zone"),
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="space-y-4"
    >
      {customerKyc.length < 1 ? (
        <KycStart />
      ) : phoneStep?.status !== "COMPLETED" ||
        bvnStep?.status !== "COMPLETED" ? (
        <KycContinue />
      ) : null}
      <Grid columns={{ initial: "1", lg: "2" }} gap="4">
        <div>
          <Grid gap="4">
            <GameCard />
            <GameZoneCardTemp data={gameZoneData} />
            <AdBanner />
            <TopGamers />
            {/* <ReferBox refCode={user?.referralCode || ""} /> */}
          </Grid>
        </div>
        <div className="bg-white rounded-[20px] hidden lg:inline-block p-4">
          <TransactionHistory />
        </div>
      </Grid>
    </motion.div>
  );
}

export default HomeTab;
