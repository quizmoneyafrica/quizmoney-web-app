import LiveGameQueries from "@/app/api/queries/liveGameQueries";
import ProtectedRoute from "@/app/security/protectedRoute";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <LiveGameQueries />
      {children}
    </ProtectedRoute>
  );
}

export default Layout;
