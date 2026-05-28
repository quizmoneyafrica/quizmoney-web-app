"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import { useLiveGameStore } from "@/lib/live-game-store";
import LobbyScreen from "../cmp/LobbyScreen";
import GameScreen from "../cmp/GameScreen";
import GameCompleted from "../cmp/GameCompleted";
import KickedOut from "../cmp/KickedOut";
import Results from "../cmp/Results";
import NotStarted from "../cmp/NotStarted";

function Page() {
  const params = useParams();
  const gameId = (params?.id as string) ?? "";
  const phase = useLiveGameStore((s) => s.phase);
  const reset = useLiveGameStore((s) => s.reset);

  // ── Back / reload prevention ─────────────────────────────────────────────
  useEffect(() => {
    window.history.replaceState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast.error("You cannot go back during a live game.", {
        position: toastPosition,
      });
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Reset store when navigating away from the live-game route
      reset();
    };
  }, [reset]);

  // ── Phase routing ────────────────────────────────────────────────────────
  // lobby-phase screens are all handled inside LobbyScreen (it owns the
  // joining → lobby → locked → countdown states internally)
  if (
    phase === "idle" ||
    phase === "joining" ||
    phase === "lobby" ||
    phase === "locked" ||
    phase === "countdown" ||
    phase === "error"
  ) {
    return <LobbyScreen gameId={gameId} />;
  }

  if (phase === "playing") return <GameScreen />;
  if (phase === "completed") return <GameCompleted />;
  if (phase === "result") return <Results />;
  if (phase === "cancelled") return <KickedOut />;

  return <NotStarted />;
}

export default Page;
