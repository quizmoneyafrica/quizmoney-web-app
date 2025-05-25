"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { getAuthUser } from "@/app/api/userApi";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";
import AppLoader from "@/app/components/loader/loader";

function Page() {
  const router = useRouter();
  const { liveGameData, isAllowedInGame, gameEnded } = useAppSelector(
    (state) => state.game
  );
  const user = getAuthUser();
  const [isUserInGame, setIsUserInGame] = useState<boolean | null>(null);

  useEffect(() => {
    if (!liveGameData || !user) {
      setIsUserInGame(null);
      return;
    }

    const userId = user?.objectId;
    const isInGame =
      Array.isArray(liveGameData?.users) &&
      liveGameData?.users.includes(userId);

    if (!isInGame) {
      setIsUserInGame(false);
      router.replace("/home");
    } else {
      setIsUserInGame(true);
    }
  }, [liveGameData, user, router]);

  useEffect(() => {
    // Lock scroll and gestures on this page only
    const preventTouch = (e: TouchEvent) => e.preventDefault();

    if (!gameEnded) {
      // Disable scroll and gestures
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.overscrollBehavior = "none";
      document.addEventListener("touchmove", preventTouch, { passive: false });
    } else {
      // Restore scroll and gestures
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
      document.removeEventListener("touchmove", preventTouch);
    }

    return () => {
      // Restore default behavior when leaving the page
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
      document.removeEventListener("touchmove", preventTouch);
    };
  }, [gameEnded]);

  if (!liveGameData)
    return (
      <>
        <div className="min-h-screen lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
          <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
            <div className="w-full bg-error-50 text-center text-sm border-4 border-error-500 rounded-[10px] px-4 py-4 space-y-4 flex flex-col items-center justify-center">
              <span className="text-5xl">🎮 </span>
              <p className="font-medium text-base">
                You probably refreshed this page
              </p>
              <p>
                Go back home to see game details
                <br /> Tap the button 👇
              </p>

              <CustomButton
                width="medium"
                onClick={() => router.replace("/home")}
              >
                Go Home
              </CustomButton>
            </div>
          </div>
        </div>
      </>
    );

  // Show nothing until we verify if the user is in the game
  if (isUserInGame === null) return null;

  // If user is not in the game, return null (they’ll be redirected anyway)
  if (!isUserInGame) return null;

  // const diff = differenceInSeconds(
  //   new Date(liveGameData?.startDate.iso),
  //   new Date()
  // );

  if (!isAllowedInGame)
    return (
      <>
        <div className="min-h-screen lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
          <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
            <div className="w-full bg-error-50 text-center text-sm border-4 border-error-500 rounded-[10px] px-4 py-4 space-y-4 flex flex-col items-center justify-center">
              <span className="text-5xl">🎮 </span>
              <p className="font-medium text-base">
                Next Game Is not live yet!
              </p>
              <p>
                Want to know when the next game is?
                <br /> Tap the button 👇
              </p>

              <CustomButton
                width="medium"
                onClick={() => router.replace("/home")}
              >
                Go Home
              </CustomButton>
            </div>
          </div>
        </div>
      </>
    );

  return <AppLoader />;
}

export default Page;
