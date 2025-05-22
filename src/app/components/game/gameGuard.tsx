"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameApi from "@/app/api/game";
import { useAppSelector } from "@/app/hooks/useAuth";
import { getAuthUser } from "@/app/api/userApi";

export default function GameGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const gameData = useAppSelector((state) => state.game.nextGameData);
  const [loading, setLoading] = useState(true);
  const user = getAuthUser();

  useEffect(() => {
    const verifySession = async () => {
      if (!user || !gameData?.objectId) {
        router.replace("/home");
        return;
      }

      try {
        const res = await GameApi.checkSessionStatus(gameData.objectId);
        const isActive = res.data.result?.active;

        if (!isActive) {
          router.replace("/home");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Session check failed", err);
        router.replace("/home");
      }
    };

    verifySession();
  }, [gameData?.objectId, user, router]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-primary-900 hero text-white flex items-center justify-center">
        <p>Checking game session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
