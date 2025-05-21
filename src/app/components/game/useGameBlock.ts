"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setIsAllowedInGame } from "@/app/store/gameSlice";

export default function UseGameBlock() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handlePopState = () => {
      dispatch(setIsAllowedInGame(false));
      router.replace("/home");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch, router, pathname]);
}
