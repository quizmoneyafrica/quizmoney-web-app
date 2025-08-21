/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import CoinCard from "./Card";
import CoinTarget from "./CoinTarget";
import CoinTransactions from "./CoinTransactions";
import UserAPI from "@/app/api/userApi";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setUserCoinTransactions } from "@/app/store/coinSlice";
import QmDrawer from "@/app/components/drawer/drawer";
import RedeemModal from "./RedeemModal";

function Coin() {
  const [openRedeem, setOpenRedeem] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // const fetchUserCoin = async () => {
    //   try {
    //     const res = await UserAPI.fetchUserCoinAccount();
    //     console.log("Coin Balance", res.coinAccount.balance);
    //     dispatch(updateCoinBalance(res.coinAccount.balance));
    //   } catch (err: any) {
    //     toast.error(`${err.message}`, { position: toastPosition });
    //   }
    // };
    const fetchUserCoinTransactions = async () => {
      try {
        const res = await UserAPI.fetchCoinTransactions();
        console.log("Coin Transactions", res.userCoinTransactions);
        dispatch(setUserCoinTransactions(res.userCoinTransactions));
      } catch (err: any) {
        toast.error(`${err.message}`, { position: toastPosition });
      }
    };

    // fetchUserCoin();
    fetchUserCoinTransactions();
  }, [dispatch]);
  return (
    <div className="min-h-[100dvh] space-y-6">
      <QmDrawer
        title="Confirm Redemption"
        open={openRedeem}
        onOpenChange={setOpenRedeem}
        titleLeft
        trigger={<CoinCard setOpenRedeem={setOpenRedeem} />}
      >
        <RedeemModal setOpenRedeem={setOpenRedeem} />
      </QmDrawer>
      <CoinTarget />
      <CoinTransactions />
    </div>
  );
}

export default Coin;
