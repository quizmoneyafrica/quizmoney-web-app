import { io, Socket } from "socket.io-client";
import { useAuthStore, tokenStorage } from "@/lib/auth-store";
import { useEffect, useRef, useState } from "react";

let socketInstance: Socket | null = null;

/**
 * Global internal initializer protecting Next.js SSR window requirements
 */
export const initializeSocket = (): Socket | null => {
  if (typeof window === "undefined") return null;
  if (socketInstance !== null) return socketInstance;

  const token = tokenStorage.getAccessToken();

  socketInstance = io(
    process.env.NEXT_PUBLIC_API_URL || "https://quizmoneybe.fly.dev",
    {
      auth: {
        token: token,
      },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      autoConnect: false, // Allows controlled lifecycle attachment
    },
  );

  socketInstance.on("connect", () => {
    console.log("Socket.io global connection established");
  });

  socketInstance.on("disconnect", (reason: string) => {
    console.log(`Socket.io disconnected: ${reason}`);
  });

  socketInstance.on("connect_error", (error: Error) => {
    console.error("Socket.io connection error:", error.message);
  });

  return socketInstance;
};

export const getSocket = (): Socket => {
  if (!socketInstance) {
    const fresh = initializeSocket();
    if (!fresh)
      throw new Error("Socket cannot be resolved on Server Side Environments.");
    return fresh;
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

/**
 * Consolidated Core Hook: Shared Context Framework Tracker
 *
 * Returns a reactive socket reference so that components re-render
 * (and register their event listeners) the moment the socket is ready,
 * instead of capturing the module-level null on first render and never
 * updating.
 */
export const useSocket = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Initialise from module-level variable so components that mount after
  // the socket is already connected get the instance immediately.
  const [instance, setInstance] = useState<Socket | null>(
    () => (typeof window !== "undefined" ? socketInstance : null),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user && isAuthenticated) {
      const liveSocket = initializeSocket();
      if (liveSocket && !liveSocket.connected) {
        // Sync fresh tokens directly into the payload right before connecting
        liveSocket.auth = { token: tokenStorage.getAccessToken() };
        liveSocket.connect();
      }
      // Push the instance into state so event-listener effects re-fire
      setInstance(liveSocket);
    } else {
      disconnectSocket();
      setInstance(null);
    }
  }, [user, isAuthenticated]);

  return instance;
};

/**
 * Re-mapped to link with the unified global pool safely instead of spinning up standalone connections
 */
export const useGameEvents = () => {
  return useSocket();
};

/**
 * Reusable layout utility mapping incoming reactive events safely
 * without listener dropouts or stale component state closures.
 */
function useSocketEvent(event: string, callback: (data: any) => void) {
  const socket = useGameEvents();
  const savedCallback = useRef(callback);

  // Keep callback reference perfectly up to date without cycling event listeners
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!socket) return;

    const listener = (data: any) => {
      savedCallback.current(data);
    };

    socket.on(event, listener);

    // Clean up cleanly on unmount or if instance completely structuralizes anew
    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]);
}

// ─── Streamlined Event Hook Registry ───────────────────────────────────────

export const useGameQuestion = (onQuestion: (data: any) => void) =>
  useSocketEvent("game:question", onQuestion);

export const useGameQuestionResult = (onResult: (data: any) => void) =>
  useSocketEvent("game:question:result", onResult);

export const useGameFinished = (onFinished: (data: any) => void) =>
  useSocketEvent("game:finished", onFinished);

export const useGameLocked = (onLocked: (data: any) => void) =>
  useSocketEvent("game:locked", onLocked);

export const useGameStarted = (onStarted: (data: any) => void) =>
  useSocketEvent("game:started", onStarted);

export const useGamePlayerJoined = (onPlayerJoined: (data: any) => void) =>
  useSocketEvent("game:player:joined", onPlayerJoined);

export const useGameLobbyUpdate = (onLobbyUpdate: (data: any) => void) =>
  useSocketEvent("game:lobby:update", onLobbyUpdate);

export const useGameCancelled = (onCancelled: (data: any) => void) =>
  useSocketEvent("game:cancelled", onCancelled);

export const useGameError = (onError: (data: any) => void) =>
  useSocketEvent("game:error", onError);

export const useGameReconnected = (onReconnected: (data: any) => void) =>
  useSocketEvent("game:reconnected", onReconnected);