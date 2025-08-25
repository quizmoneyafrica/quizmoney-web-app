"use client";
import React, { useEffect, useState } from "react";
import CoinCard from "./Card";
import CoinTarget from "./CoinTarget";
import CoinTransactions from "./CoinTransactions";
import { useAppDispatch } from "@/app/hooks/useAuth";
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
      // try {
      //   const res = await UserAPI.fetchCoinTransactions();
      //   console.log("Coin Transactions", res.userCoinTransactions);
      //   dispatch(setUserCoinTransactions(res.userCoinTransactions));
      // } catch (err: any) {
      //   toast.error(`${err.message}`, { position: toastPosition });
      // }
    };

    // fetchUserCoin();
    fetchUserCoinTransactions();
  }, [dispatch]);
  return (
    <div className="min-h-[100dvh] space-y-6 w-full">
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-4">
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
      </div>

      <CoinTransactions />
    </div>
  );
}

export default Coin;
