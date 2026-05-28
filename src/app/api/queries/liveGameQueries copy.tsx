"use client";

/**
 * liveGameQueries.tsx
 *
 * Mounted by the live-game layout for the duration of the live-game route.
 * Registers socket event listeners and syncs them into the Zustand
 * live-game-store — no Redux, no crashes.
 *
 * Event → phase mapping:
 *   game:player:joined  → update totalPlayers
 *   game:locked         → phase = 'locked', update totalPlayers
 *   game:started        → phase = 'countdown'
 *   game:finished       → phase = 'completed'
 *   game:cancelled      → phase = 'cancelled'
 *
 * Reconnect handling:
 *   On every socket 'connect' event (fires on reconnect too), re-join the
 *   game room via game:join (lobby) or game:reconnect (active game) so the
 *   socket gets back into the "game:live" room the server uses for broadcasts.
 */

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
} from "@/lib/socket";
import { useLiveGameStore } from "@/lib/live-game-store";

function LiveGameQueries() {
  const socket = useSocket();
  const setPhase = useLiveGameStore((s) => s.setPhase);
  const setTotalPlayers = useLiveGameStore((s) => s.setTotalPlayers);
  const setLeaderboard = useLiveGameStore((s) => s.setLeaderboard);
  const setPendingQuestion = useLiveGameStore((s) => s.setPendingQuestion);

  // ── Reconnect: re-join "game:live" room whenever socket (re)connects ───────
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      const { phase } = useLiveGameStore.getState();
      if (
        phase === "lobby" ||
        phase === "locked" ||
        phase === "countdown"
      ) {
        // Still in pre-game — re-join lobby room
        socket.emit("game:join", {}, (res: any) => {
          if (!res?.success) {
            // Game may have started while disconnected — try reconnect path
            socket.emit("game:reconnect");
          }
        });
      } else if (phase === "playing") {
        // Game active — request current state + current question from server
        socket.emit("game:reconnect");
      }
    };

    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket]);

  useGamePlayerJoined((data: { totalPlayers?: number }) => {
    if (data?.totalPlayers != null) {
      setTotalPlayers(data.totalPlayers);
    }
  });

  useGameLocked((data: { totalPlayers?: number }) => {
    if (data?.totalPlayers != null) {
      setTotalPlayers(data.totalPlayers);
    }
    setPhase("locked");
  });

  useGameStarted(() => {
    setPhase("countdown");
  });

  /**
   * Buffer game:question if it arrives before the countdown finishes
   * (i.e. before GameScreen has mounted and registered its own listener).
   * The phase transition to 'playing' is owned by the LobbyScreen countdown —
   * this handler never changes the phase, it only saves the question so
   * GameScreen can read it the instant it mounts.
   * Once phase is 'playing', GameScreen's own useGameQuestion hook takes over.
   */
  useGameQuestion((data: any) => {
    if (useLiveGameStore.getState().phase !== "playing") {
      setPendingQuestion(data);
    }
  });

  useGameFinished((data: any) => {
    if (Array.isArray(data?.leaderboard)) {
      setLeaderboard(data.leaderboard);
    }
    setPhase("completed");
  });

  useGameCancelled(() => {
    setPhase("cancelled");
  });

  /**
   * game:reconnected — server confirms room re-join and may resend current
   * question (see socket/index.ts). If game is active and a question is
   * included, buffer it so GameScreen picks it up.
   */
  useGameReconnected((data: any) => {
    if (data?.status === "active" && useLiveGameStore.getState().phase !== "playing") {
      setPhase("playing");
    }
  });

  return null;
}

export default LiveGameQueries;
