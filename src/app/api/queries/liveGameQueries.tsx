"use client";

import { useEffect } from "react";
import {
  useGameLocked,
  useGameStarted,
  useGameCancelled,
  useGamePlayerJoined,
  useGameFinished,
  useGameQuestion,
  useGameReconnected,
  useSocket,
  useGameError,
} from "@/lib/socket";
import { useLiveGameStore } from "@/lib/live-game-store";

function LiveGameQueries() {
  const socket = useSocket();
  const setPhase = useLiveGameStore((s) => s.setPhase);
  const setTotalPlayers = useLiveGameStore((s) => s.setTotalPlayers);
  const setLeaderboard = useLiveGameStore((s) => s.setLeaderboard);
  const setPendingQuestion = useLiveGameStore((s) => s.setPendingQuestion);
  const setError = useLiveGameStore((s) => s.setError);

  // Debug all events
  useEffect(() => {
    if (!socket) return;

    const events = [
      "game:player:joined",
      "game:locked",
      "game:started",
      "game:question",
      "game:question:result",
      "game:finished",
      "game:cancelled",
      "game:reconnected",
      "game:error",
      "game:status",
    ];

    events.forEach((event) => {
      socket.on(event, (data) => {
        console.log(`📡 [${event}]`, data);
      });
    });

    return () => {
      events.forEach((event) => socket.off(event));
    };
  }, [socket]);

  

  // Core handlers
  useGamePlayerJoined((data) => {
    if (data?.totalPlayers != null) setTotalPlayers(data.totalPlayers);
  });

  useGameLocked((data) => {
    console.log("🔒 Game Locked");
    if (data?.totalPlayers != null) setTotalPlayers(data.totalPlayers);
    setPhase("locked");
  });

  useGameStarted(() => {
    console.log("🚀 Game Started");
    setPhase("countdown");
  });

  useGameQuestion((data) => {
    console.log("❓ New Question");
    if (useLiveGameStore.getState().phase !== "playing") {
      setPendingQuestion(data);
    }
  });

  useGameFinished((data) => {
    console.log("🏁 Game Finished");
    if (Array.isArray(data?.leaderboard)) setLeaderboard(data.leaderboard);
    setPhase("completed");
  });

  useGameReconnected((data) => {
    console.log("🔄 Reconnected:", data);

    if (!data) return;

    const { status, currentQuestion } = data;

    if (status === "active" || currentQuestion > 0) {
      setPhase("playing");
    } else if (status === "locked") {
      setPhase("locked");
    } else if (status === "started" || status === "countdown") {
      setPhase("countdown");
    }
    // "lobby" = do nothing (stay in lobby)
  });

  return null;
}

export default LiveGameQueries;
