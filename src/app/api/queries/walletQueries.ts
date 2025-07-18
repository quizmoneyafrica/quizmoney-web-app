"use client";
import { useAppDispatch, useAuth } from "@/app/hooks/useAuth";
import { useStompClient } from "@/app/hooks/useStompClient";
import { addSubscription, removeSubscription } from "@/app/store/stompSlice";
import { setWalletBalance } from "@/app/store/walletSlice";
import { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";
// import { useCallback, useEffect } from "react";
// import WalletApi from "../wallet";
// import { setTransactions, setWalletBalance } from "@/app/store/walletSlice";
// import { liveQueryClient } from "@/app/api/parse/parseClient";
// import Parse from "parse";
// import { getAuthUser } from "../userApi";
// import { updateCoinBalance } from "@/app/store/coinSlice";

function WalletQueries() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const onMessage = (msg: IMessage) => {
    console.log("💰 Wallet Update:", msg.body);
    dispatch(setWalletBalance(Number(msg.body)));
  };
  useStompClient({ onMessage });

  useEffect(() => {
    dispatch(addSubscription(`/user/${user?.email}/queue/wallet`));
    return () => {
      dispatch(removeSubscription(`/user/${user?.email}/queue/wallet`));
    };
  }, [dispatch, user?.email]);

  return null;
}

export default WalletQueries;
