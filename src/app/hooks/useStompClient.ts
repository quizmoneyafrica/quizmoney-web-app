import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";

export const useStompClient = () => {
  const { accessToken } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());

  useEffect(() => {
    const client = new Client({
      brokerURL: "https://frontoffice.quizmoney.ng/ws",
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
        console.log("✅ STOMP Connected", Date.now());
        // client.subscribe(`/user/${userEmail}/queue/wallet`, onMessage);
      },
      onStompError: (frame) => {
        console.error(" ❌STOMP Error", frame.headers["message"]);
      },
    });
    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [accessToken]);

  const subscribe = (
    destination: string,
    callback: (msg: IMessage) => void
  ) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.warn("STOMP client not connected yet");
      return;
    }

    if (subscriptionsRef.current.has(destination)) {
      console.warn(`Already subscribed to ${destination}`);
      return;
    }

    const sub = clientRef.current.subscribe(destination, callback);
    subscriptionsRef.current.set(destination, sub);
    console.log(`📡 Subscribed to ${destination}`);
  };

  const unsubscribe = (destination: string) => {
    const sub = subscriptionsRef.current.get(destination);
    if (sub) {
      sub.unsubscribe();
      subscriptionsRef.current.delete(destination);
      console.log(`🔌 Unsubscribed from ${destination}`);
    }
  };

  const send = (destination: string, body: string) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination,
        body,
      });
    }
  };

  return {
    subscribe,
    unsubscribe,
    send,
    isConnected: clientRef.current?.connected ?? false,
  };
};
