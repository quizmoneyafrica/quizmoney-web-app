import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import { useAppSelector, useAuth } from "./useAuth";

export const useStompClient = ({
  onMessage,
}: {
  onMessage: (msg: IMessage) => void;
}) => {
  const { accessToken } = useAuth();
  const subscriptions = useAppSelector((state) => state.stompSub.subscriptions);
  const clientRef = useRef<Client | null>(null);
  const subsRef = useRef<Map<string, StompSubscription>>(new Map());
  const subscriptionsRef = useRef<string[]>(subscriptions);

  useEffect(() => {
    subscriptionsRef.current = subscriptions;
  }, [subscriptions]);

  useEffect(() => {
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
        subscriptions.forEach((dest) => {
          if (!subsRef.current.has(dest)) {
            const sub = client.subscribe(dest, onMessage);
            subsRef.current.set(dest, sub);
            console.log(`📡 Subscribed to ${dest}`);
          }
        });
      },
      onWebSocketClose: () => {
        console.log("🔌 WEBSOCKET STOMP Disconnected");
        subsRef.current.clear();
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
  }, [accessToken, onMessage, subscriptions]);

  return {
    isConnected: clientRef.current?.connected ?? false,
  };
};
