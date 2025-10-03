import LiveGameQueries from "@/app/api/queries/liveGameQueries";
import NextGameQueries from "@/app/api/queries/nextGameQueries";
import ProtectedRoute from "@/app/security/protectedRoute";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <LiveGameQueries />
      <NextGameQueries />
      {children}
    </ProtectedRoute>
  );
}

export default Layout;
