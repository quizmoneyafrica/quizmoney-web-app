"use client";

import AppHeader from "@/app/layout/appHeader";
import BottomNavigation from "@/app/layout/BottomNavigation";
import SidebarNav from "@/app/layout/SidebarNav";
import ProtectedRoute from "@/app/security/protectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import CountdownScreen from "@/app/components/game/countDown";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gameData = useSelector((state: RootState) => state.game.nextGameData);
  console.log("StartDate:", gameData?.startDate);

  return (
    <ProtectedRoute>
      {/* Countdown screen if startDate is available */}
      {gameData?.startDate && (
        <CountdownScreen startDate={gameData.startDate} />
      )}

      <div
        className="lg:h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr] 
         lg:grid-rows-1 grid-areas-mobile lg:grid-areas-desktop"
      >
        <SidebarNav />
        <main className="grid-in-content bg-[#F7F7F7] lg:h-screen">
          <div className="h-full overflow-y-auto px-6 pt-4 pb-24 lg:pb-6">
            <AppHeader />
            {children}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </ProtectedRoute>
  );
}
