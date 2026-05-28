// import ProtectedRoute from "@/app/security/protectedRoute";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {/* <ProtectedRoute> */}
      {children}
      {/* </ProtectedRoute> */}
    </main>
  );
}

export default Layout;
