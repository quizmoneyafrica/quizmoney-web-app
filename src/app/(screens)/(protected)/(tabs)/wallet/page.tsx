/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import WalletLayout from "@/app/components/wallet/WalletLayout";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Pagination } from "swiper/modules";
import { useSearchParams } from "next/navigation";

function Page() {
  // const {
  //   wallet: walletData,
  // } = useAppSelector((state) => state.wallet);

  // const wallet = walletData.find((w) => w.currency === "NGN")! || {};
  const swiperRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const initialSlide = tab === "coin" ? 1 : 0;

  const fetchWallet = useCallback(async () => {
    
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    const fetchPayoutAccounts = async () => {
      // try {
      //   dispatch(setWalletLoading(true));
      //   const res = await WalletApi.fetchPayoutBanks();

      //   if (res?.data) {
      //     dispatch(setPayoutBanks(res.data));
      //   }
      // } catch (error) {
      //   console.log(error, "Wallet Error");
      // } finally {
      //   dispatch(setWalletLoading(false));
      // }
    };

    const fetchTransactions = async () => {
      // try {
      //   dispatch(setTransactionsLoading(true));
      //   const res = await WalletApi.fetchTransactions({});
      //   console.log(res, "Transactions");

      //   if (res?.data?.content) {
      //     dispatch(setTransactions(res?.data.content ?? []));
      //   }
      // } catch (error) {
      //   console.log(error, "Transaction Error");
      // } finally {
      //   dispatch(setTransactionsLoading(false));
      // }
    };

    fetchTransactions();
    fetchPayoutAccounts();
  }, []);

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
          {/* <Coin /> */}
        </SwiperSlide>
      </Swiper>
    </motion.div>
  );
}

export default Page;
