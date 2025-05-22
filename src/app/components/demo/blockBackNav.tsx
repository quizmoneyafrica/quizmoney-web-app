"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { clearDemoData } from "@/app/store/demoSlice";

export default function UseBlockBackNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handlePopState = () => {
      dispatch(clearDemoData());
      router.replace("/home");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch, router, pathname]);
}
