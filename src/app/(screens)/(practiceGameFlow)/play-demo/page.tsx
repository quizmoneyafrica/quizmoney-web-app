"use client";
import UseBlockBackNavigation from "@/app/components/demo/blockBackNav";
import DemoGameSCreen from "@/app/components/demo/game/demoGameSCreen";
import WelcomeScreen from "@/app/components/demo/welcomeScreen";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Page() {
  UseBlockBackNavigation();
  const demoData = useSelector((state: RootState) => state.demo.data);
  const [showGame, setShowGame] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //   dispatch(clearDemoData());
  //   before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  return (
    <div>
      {showGame && demoData ? (
        <>
          <DemoGameSCreen />
        </>
      ) : (
        <WelcomeScreen
          setShowGame={setShowGame}
          loading={loading}
          setLoading={setLoading}
          router={router}
        />
      )}
    </div>
  );
}

export default Page;
