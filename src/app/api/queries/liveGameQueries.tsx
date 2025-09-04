"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { useStompClient } from "@/app/hooks/useStompClient";
import { setCurrentLiveQuestion } from "@/app/store/gameSlice";
import { addSubscription, removeSubscription } from "@/app/store/stompSlice";
import { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";
import GameApi from "../game";

function LiveGameQueries() {
  const dispatch = useAppDispatch();

  const onMessage = async (msg: IMessage) => {
    try {
      const que = JSON.parse(msg.body);
      if (que?.id && que?.options?.length > 0) {
        dispatch(setCurrentLiveQuestion(que));
        console.log("Current Question", que);
      } else {
        console.warn("Fallback: Empty WebSocket payload");
        const res = await GameApi.getCurrentQuestion();
        dispatch(setCurrentLiveQuestion(res.data));
      }
    } catch (err) {
      console.error("WebSocket JSON parse failed, using fallback", err);
      //   const res = await GameApi.getCurrentQuestion();
      //   dispatch(setCurrentLiveQuestion(res.data));
    }
  };
  useStompClient({ onMessage });

  useEffect(() => {
    dispatch(addSubscription(`/topic/questions`));
    return () => {
      dispatch(removeSubscription(`/topic/questions`));
    };
  }, [dispatch]);

  return null;
}

export default LiveGameQueries;
