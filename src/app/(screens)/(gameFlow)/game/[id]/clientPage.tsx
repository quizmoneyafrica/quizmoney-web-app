"use client";
import React, { useEffect } from "react";
import GameScreen from "@/app/components/game/gameScreen";
import { useAppSelector } from "@/app/hooks/useAuth";
import CustomButton from "@/app/utils/CustomBtn";
import { useRouter } from "next/navigation";

export default function ClientPage() {
  const { gameEnded, liveGameData } = useAppSelector((state) => state.game);
  const router = useRouter();
  useEffect(() => {
    const handlePopState = () => {
      // Prevent back navigation
      window.history.pushState(null, "", window.location.href);
    };

    // Push a new history entry
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Clean up on unmount
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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

  // if (!gameId) return null;

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
                Go to home to see next game details
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

  return <GameScreen />;
}
