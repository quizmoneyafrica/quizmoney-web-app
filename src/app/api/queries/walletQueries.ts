"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { useStompClient } from "@/app/hooks/useStompClient";
import { addSubscription, removeSubscription } from "@/app/store/stompSlice";
import { setWalletBalance } from "@/app/store/walletSlice";
import { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";

function WalletQueries() {
  const dispatch = useAppDispatch();

  const onMessage = (msg: IMessage) => {
    console.log("💰 Wallet Update:", msg.body);
    dispatch(setWalletBalance(Number(msg.body)));
  };
  useStompClient({ onMessage });

  useEffect(() => {
    dispatch(addSubscription(`/user/queue/wallet`));
    return () => {
      dispatch(removeSubscription(`/user/queue/wallet`));
    };
  }, [dispatch]);

  return null;
}

export default WalletQueries;
