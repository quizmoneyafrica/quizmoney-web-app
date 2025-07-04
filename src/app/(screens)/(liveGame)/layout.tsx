import AppLiveQueries from "@/app/api/queries/AppLiveQueries";
import ProtectedRoute from "@/app/security/protectedRoute";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLiveQueries />
      {children}
    </ProtectedRoute>
  );
}

export default Layout;
