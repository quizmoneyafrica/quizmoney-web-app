import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import { useAppSelector, useAuth } from "./useAuth";

type DestinationHandlerMap = Map<string, (msg: IMessage) => void>;
const handlers: DestinationHandlerMap = new Map();

export const registerStompHandler = (
  destination: string,
  handler: (msg: IMessage) => void
) => {
  handlers.set(destination, handler);
};

export const unregisterStompHandler = (destination: string) => {
  handlers.delete(destination);
};

export const useStompClient = () => {
  const { accessToken, user } = useAuth();
  const subscriptions = useAppSelector((state) => state.stompSub.subscriptions);
  const clientRef = useRef<Client | null>(null);
  const subsRef = useRef<Map<string, StompSubscription>>(new Map());
  const subscriptionsRef = useRef<string[]>(subscriptions);
  const retryCountRef = useRef<number>(0);
  const MAX_RETRIES = 10;

  useEffect(() => {
    subscriptionsRef.current = subscriptions;
  }, [subscriptions]);

  useEffect(() => {
    if (!user?.firstName || !accessToken) return;

    if (clientRef.current?.active) {
      console.log("🔁 STOMP reconnect with new token");
      clientRef.current.deactivate();
    }

    const client = new Client({
      brokerURL: "wss://frontoffice.quizmoney.ng/ws",
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => {
        console.log(`[STOMP DEBUG] ${msg}`);
      },
      onConnect: () => {
        console.log("✅ STOMP Connected");
        retryCountRef.current = 0;

        subscriptionsRef.current.forEach((dest) => {
          if (!subsRef.current.has(dest)) {
            const handler = handlers.get(dest);
            if (handler) {
              const sub = client.subscribe(dest, handler);
              subsRef.current.set(dest, sub);
              console.log(`📡 Subscribed to ${dest}`);
            } else {
              console.warn(`⚠️ No handler registered for ${dest}`);
            }
          }
        });
      },
      onWebSocketClose: () => {
        console.log("🔌 WEBSOCKET STOMP Disconnected");
        subsRef.current.clear();

        retryCountRef.current += 1;
        console.warn(`Reconnect attempt #${retryCountRef.current}`);

        if (retryCountRef.current > MAX_RETRIES) {
          console.error("❌ Max reconnect attempts reached. Stopping client.");
          client.deactivate();
          client.reconnectDelay = 0;
        }
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [accessToken, subscriptions, user?.firstName]);

  return {
    isConnected: clientRef.current?.connected ?? false,
  };
};
