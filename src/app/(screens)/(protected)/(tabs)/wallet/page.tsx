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
    // SET AUTH USER WALLET DATA
    const fetchWallet = async () => {
      try {
        dispatch(setTransactionsLoading(true));
        const res = await WalletApi.fetchTransactions();
        console.log(res?.data);
        if (res?.data?.groupedTransactions) {
          dispatch(setTransactions(res?.data?.groupedTransactions));
        } else {
        }
      } catch (error) {
        console.log(error, "Transaction Error");
      } finally {
        dispatch(setTransactionsLoading(false));
      }
    };
    fetchWallet();

    // SET LIST OF BANKS
    (async () => {
      try {
        const response = await WalletApi.listBanks();

        let gg = {
          message: "Transactions fetched successfully",
          groupedTransactions: [
            {
              date: "2025-05-12",
              transactions: [
                {
                  amount: 600,
                  title: "Wallet top-up",
                  description: "Funds added to your wallet.",
                  type: "deposit",
                  status: "completed",
                  user: {
                    __type: "Pointer",
                    className: "_User",
                    objectId: "9o2PZV9Gyi",
                  },
                  createdAt: "2025-05-12T19:58:21.447Z",
                  updatedAt: "2025-05-12T19:58:21.447Z",
                  objectId: "awOp692Qed",
                  __type: "Object",
                  className: "UserWalletTransaction",
                },
              ],
            },
          ],
          totalTransactions: 1,
          totalPages: 1,
          currentPage: 1,
          hasPreviousPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        };

        if (response.data.result?.data) {
          dispatch(setBanks(response.data.result?.data));
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
