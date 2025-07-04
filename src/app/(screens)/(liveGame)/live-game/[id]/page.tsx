"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import React, { useEffect, useState } from "react";
import LobbyScreen from "../cmp/LobbyScreen";
import GameScreen from "../cmp/GameScreen";
import GameCompleted from "../cmp/GameCompleted";
import KickedOut from "../cmp/KickedOut";
import NotStarted from "../cmp/NotStarted";
import Results from "../cmp/Results";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
// import { setPhase, stopAudio } from "@/app/store/gameSlice";

function Page() {
  const dispatch = useAppDispatch();
  const { phase } = useAppSelector((state) => state.game);
  const [userTime, setUserTime] = useState("");
  useEffect(() => {
    // Replace initial state so back doesn't work
    window.history.replaceState(null, "", window.location.href);
    // Clear history forward stack to make back/forward disabled
    window.history.pushState(null, "", window.location.href);
    window.history.forward();

    // Prevent browser back
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast.error("You cannot go back during a live game.", {
        position: toastPosition,
      });
    };

    // Block reload or tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleVisibilityChange = () => {
      if (document.hidden && phase === "playing") {
        // dispatch(setPhase("cancelled"));
        // dispatch(stopAudio());
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.history.replaceState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, phase]);

  if (phase === "lobby") return <LobbyScreen />;
  if (phase === "playing") return <GameScreen setUserTime={setUserTime} />;
  if (phase === "completed") return <GameCompleted />;
  if (phase === "result") return <Results userTime={userTime} />;
  if (phase === "cancelled") return <KickedOut />;
  return <NotStarted />;
}

export default Page;
