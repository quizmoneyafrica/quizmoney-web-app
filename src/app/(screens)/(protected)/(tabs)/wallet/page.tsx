/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import WalletLayout from "@/app/components/wallet/WalletLayout";
import {
  setWallet,
  setWalletLoading,
  setTransactionsLoading,
  setTransactions,
  setBanks,
  setPayoutBanks,
  setVirtualAccount,
} from "@/app/store/walletSlice";
import WalletApi from "@/app/api/wallet";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Pagination } from "swiper/modules";
import Coin from "./coin/coin";
import { useSearchParams } from "next/navigation";

function Page() {
  const dispatch = useAppDispatch();
  const { wallet, transactions, banks, payoutBanks } = useAppSelector(
    (state) => state.wallet
  );
  const swiperRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const initialSlide = tab === "coin" ? 1 : 0;

  useEffect(() => {
    const fetchWallet = async () => {
      if (wallet === undefined)
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
    };
    const fetchPayoutAccounts = async () => {
      if (payoutBanks === undefined)
        try {
          dispatch(setWalletLoading(true));
          const res = await WalletApi.fetchPayoutBanks();
          // console.log(res.data, "Payout Accounts");

          if (res?.data) {
            dispatch(setPayoutBanks(res.data));
          }
        } catch (error) {
          // console.log(error, "Wallet Error");
        } finally {
          dispatch(setWalletLoading(false));
        }
    };

    const fetchTransactions = async () => {
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
    };

    // SET LIST OF BANKS
    // const fetchBankList = async () => {
    //   if (banks.length <= 0) {
    //     try {
    //       const response = await WalletApi.fetchBanks();
    //       if (response?.data) {
    //         dispatch(setBanks(response.data));
    //       }
    //     } catch (error) {
    //       console.error("ERROR FETCHING BANKS", error);
    //     }
    //   }
    // };
    // if (banks.length <= 0) {
    //   (async () => {
    //     try {
    //       const response = await WalletApi.listBanks();
    //       if (response?.data) {
    //         dispatch(setBanks(response?.data));
    //       }
    //     } catch (error) {
    //       console.log(error, "ERROR FETCHING BANKS");
    //     }
    //   })();
    // }
    // (async () => {
    //   try {
    //     const { email } = getAuthUser();
    //     const response = await WalletApi.fetchDedicatedAccount({
    //       email,
    //     });
    //     if (response?.data) {
    //       console.log(
    //         "============fetchDedicatedAccount========================"
    //       );
    //       console.log(JSON.stringify(response.data, null, 2));
    //       console.log(
    //         "==========fetchDedicatedAccount=========================="
    //       );
    //     }
    //   } catch (error) {
    //     console.log(error, "ERROR FETCHING BANKS");
    //   }
    // })();
    fetchWallet();
    fetchTransactions();
    fetchPayoutAccounts();
  }, [banks.length, dispatch, transactions.length, wallet, payoutBanks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <Swiper
        pagination={false}
        modules={[Pagination]}
        className="mySwiper"
        initialSlide={initialSlide}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.slideTo(initialSlide);
        }}
      >
        <SwiperSlide>
          <WalletLayout />
        </SwiperSlide>
        <SwiperSlide>
          <Coin />
        </SwiperSlide>
      </Swiper>
    </motion.div>
  );
}

export default Page;
