"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import {
  registerStompHandler,
  unregisterStompHandler,
  useStompClient,
} from "@/app/hooks/useStompClient";
import { updateNextGameData } from "@/app/store/gameSlice";
import { addSubscription, removeSubscription } from "@/app/store/stompSlice";
import { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";

function NextGameQueries() {
  const dispatch = useAppDispatch();
  const destination = "/topic/next-game";

  useStompClient();

  useEffect(() => {
    const handler = (msg: IMessage) => {
      const nextGame = JSON.parse(msg.body);
      console.log("🎲 Next Game Update:", msg.headers.destination, nextGame);
      dispatch(updateNextGameData(nextGame));
    };

    registerStompHandler(destination, handler);
    dispatch(addSubscription(destination));

    return () => {
      unregisterStompHandler(destination);
      dispatch(removeSubscription(destination));
    };
  }, [dispatch]);

  return null;
}

export default NextGameQueries;
