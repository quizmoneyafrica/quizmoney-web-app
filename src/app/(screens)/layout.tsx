import { initializeSocket } from "@/lib/socket";
import React from "react";

function SocketLayout({ children }: { children: React.ReactNode }) {
  initializeSocket();
  return <>{children}</>;
}

export default SocketLayout;
