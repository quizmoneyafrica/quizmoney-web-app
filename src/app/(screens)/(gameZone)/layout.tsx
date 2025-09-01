import AppLiveQueries from "@/app/api/queries/AppLiveQueries";
import SidebarNav from "@/app/layout/SidebarNav";
import ProtectedRoute from "@/app/security/protectedRoute";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLiveQueries />{" "}
      <div
        className="lg:h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr] 
         lg:grid-rows-1 grid-areas-mobile lg:grid-areas-desktop"
      >
        <SidebarNav />
        <main className="grid-in-content bg-[#F7F7F7] min-h-screen lg:h-screen w-full max-w-screen lg:max-w-[calc(100vw-250px)]">
          <div className="h-full overflow-y-auto">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default Layout;
