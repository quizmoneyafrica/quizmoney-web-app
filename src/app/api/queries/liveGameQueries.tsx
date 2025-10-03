"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setCurrentLiveQuestion, setOptionLocked } from "@/app/store/gameSlice";
import { addSubscription, removeSubscription } from "@/app/store/stompSlice";
import { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";
import GameApi from "../game";
import {
  registerStompHandler,
  unregisterStompHandler,
  useStompClient,
} from "@/app/hooks/useStompClient";

function LiveGameQueries() {
  const dispatch = useAppDispatch();
  const destination = "/topic/questions";

  useStompClient();

  useEffect(() => {
    const handler = async (msg: IMessage) => {
      // console.log("💰 Wallet Update:", msg.headers.destination, msg.body);
      try {
        const que = JSON.parse(msg.body);
        if (que?.id && que?.options?.length > 0) {
          dispatch(setCurrentLiveQuestion(que));
          dispatch(setOptionLocked(false));
          console.log("Current Question", que);
        } else {
          console.warn("Fallback: Empty WebSocket payload");
          const res = await GameApi.getCurrentQuestion();
          dispatch(setCurrentLiveQuestion(res.data));
          dispatch(setOptionLocked(false));
        }
      } catch (err) {
        console.error("WebSocket JSON parse failed, using fallback", err);
        //   const res = await GameApi.getCurrentQuestion();
        //   dispatch(setCurrentLiveQuestion(res.data));
      }
    };

    registerStompHandler(destination, handler);
    dispatch(addSubscription(destination));

    return () => {
      unregisterStompHandler(destination);
      dispatch(removeSubscription(destination));
    };
  }, [dispatch]);

  // const onMessage = async (msg: IMessage) => {
  //   try {
  //     const que = JSON.parse(msg.body);
  //     if (que?.id && que?.options?.length > 0) {
  //       dispatch(setCurrentLiveQuestion(que));
  //       console.log("Current Question", que);
  //     } else {
  //       console.warn("Fallback: Empty WebSocket payload");
  //       const res = await GameApi.getCurrentQuestion();
  //       dispatch(setCurrentLiveQuestion(res.data));
  //     }
  //   } catch (err) {
  //     console.error("WebSocket JSON parse failed, using fallback", err);
  //     //   const res = await GameApi.getCurrentQuestion();
  //     //   dispatch(setCurrentLiveQuestion(res.data));
  //   }
  // };
  // useStompClient({ onMessage });

  // useEffect(() => {
  //   dispatch(addSubscription(`/topic/questions`));
  //   return () => {
  //     dispatch(removeSubscription(`/topic/questions`));
  //   };
  // }, [dispatch]);

  return null;
}

export default LiveGameQueries;
