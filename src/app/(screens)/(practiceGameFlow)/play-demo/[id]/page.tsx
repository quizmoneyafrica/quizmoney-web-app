"use client";
import DemoGameSCreen from "@/app/components/demo/game/demoGameSCreen";
import React, { useEffect } from "react";
// import { notFound } from "next/navigation";
// import UseBlockBackNavigation from "@/app/components/demo/blockBackNav";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";

function Page() {
  // UseBlockBackNavigation();
  useEffect(() => {
    // Replace initial state so back doesn't work
    window.history.replaceState(null, "", window.location.href);
    // Clear history forward stack to make back/forward disabled
    window.history.pushState(null, "", window.location.href);
    window.history.forward();

    // Prevent browser back
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast.error("You cannot go back during a live game.", {
        position: toastPosition,
      });
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);

    // Block reload or tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  // if (!gameId) return notFound();
  return (
    <>
      <DemoGameSCreen />
    </>
  );
}

export default Page;
