"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { useStompClient } from "@/app/hooks/useStompClient";
import { addSubscription, removeSubscription } from "@/app/store/stompSlice";
import { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";

function NextGameQueries() {
  const dispatch = useAppDispatch();

  const onMessage = (msg: IMessage) => {
    try {
      const que = JSON.parse(msg.body);
      console.log("🎲 Next Game Update:", que);
      // dispatch(setWalletBalance(Number(msg.body)));
      // fetchTransactions();
    } catch (err) {
      console.warn("Fallback: Empty WebSocket payload", err);
    }
  };
  useStompClient({ onMessage });

  useEffect(() => {
    dispatch(addSubscription(`/topic/games/next`));
    return () => {
      dispatch(removeSubscription(`/topic/games/next`));
    };
  }, [dispatch]);

  return null;
}

export default NextGameQueries;
