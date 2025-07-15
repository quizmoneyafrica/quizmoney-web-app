import ProtectedRoute from "@/app/security/protectedRoute";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default Layout;
