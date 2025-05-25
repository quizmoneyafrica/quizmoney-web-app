"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setIsAllowedInGame } from "@/app/store/gameSlice";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsAllowedInGame(false));
    router.prefetch("/home");
    router.prefetch("/wallet");
    router.prefetch("/store");
    router.prefetch("/leaderboard");
    router.prefetch("/settings");
    router.prefetch("/support");
  });
  return <>{children}</>;
}
