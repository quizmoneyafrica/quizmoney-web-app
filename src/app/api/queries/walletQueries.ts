"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import {
  registerStompHandler,
  unregisterStompHandler,
  useStompClient,
} from "@/app/hooks/useStompClient";
import useWalletHook from "@/app/hooks/useWallet";
import { addSubscription, removeSubscription } from "@/app/store/stompSlice";
import { setWalletBalance } from "@/app/store/walletSlice";
import { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";

function WalletQueries() {
  const dispatch = useAppDispatch();
  const { fetchTransactions } = useWalletHook();
  const destination = "/user/queue/wallet";

  useStompClient();

  useEffect(() => {
    const handler = (msg: IMessage) => {
      console.log("💰 Wallet Update:", msg.headers.destination, msg.body);
      dispatch(setWalletBalance(Number(msg.body)));
      fetchTransactions();
    };

    registerStompHandler(destination, handler);
    dispatch(addSubscription(destination));

    return () => {
      unregisterStompHandler(destination);
      dispatch(removeSubscription(destination));
    };
  }, [dispatch, fetchTransactions]);

  return null;
}

export default WalletQueries;
