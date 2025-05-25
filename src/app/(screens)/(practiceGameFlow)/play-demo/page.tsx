"use client";
import WelcomeScreen from "@/app/components/demo/welcomeScreen";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function Page() {
  const demoData = useSelector((state: RootState) => state.demo.data);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //   dispatch(clearDemoData());
  //   before unload
  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, []);
  return (
    <div>
      <WelcomeScreen
        demoData={demoData}
        loading={loading}
        setLoading={setLoading}
        router={router}
      />
      {/* {showGame && demoData ? (
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
      )} */}
    </div>
  );
}

export default Page;
