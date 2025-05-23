"use client";

import AppHeader from "@/app/layout/appHeader";
import BottomNavigation from "@/app/layout/BottomNavigation";
import SidebarNav from "@/app/layout/SidebarNav";
import ProtectedRoute from "@/app/security/protectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
// import CountdownScreen from "@/app/components/game/countDown";
import { useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { setIsAllowedInGame } from "@/app/store/gameSlice";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { toastPosition } from "@/app/utils/utils";
// import GameApi, { decryptGameData } from "@/app/api/game";
// import { setLiveGameData } from "@/app/store/gameSlice";
import { useAppDispatch } from "@/app/hooks/useAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const showGameCountdown = useSelector(
  //   (state: RootState) => state.game.showGameCountdown
  // );
  const gameData = useSelector((state: RootState) => state.game.nextGameData);
  const diff = differenceInSeconds(
    new Date(gameData?.startDate.iso),
    new Date()
  );
  console.log("StartDate:", gameData?.startDate.iso);
  console.log("StartDate Difference:", diff);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    dispatch(setIsAllowedInGame(true)); // Explicitly allow access when page loads fresh
  }, [dispatch]);
  // useEffect(() => {
  //   const registerUserForGame = async () => {
  //     if (showGameCountdown) {
  //       if (diff > 0 && diff <= 300) {
  //         try {
  //           const res = await GameApi.registerForGame(gameData?.objectId);
  //           const game = res.data.result.userData;

  //           dispatch(setLiveGameData(decryptGameData(game)));
  //           router.replace("/game");

  //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         } catch (err: any) {
  //           console.log(err.message);
  //           toast.error("Failed to join game. Please try again.", {
  //             position: toastPosition,
  //           });
  //         }
  //       }
  //     }
  //   };
  //   registerUserForGame();
  // }, [diff, dispatch, gameData?.objectId, router, showGameCountdown]);
  return (
    <>
      <ProtectedRoute>
        {/* {gameData?.startDate.iso && (
          <CountdownScreen startDate={gameData.startDate.iso} />
        )} */}

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
    </>
  );
}
