"use client";
import DemoGameSCreen from "@/app/components/demo/game/demoGameSCreen";
import WelcomeScreen from "@/app/components/demo/welcomeScreen";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function Page() {
  // const dispatch = useDispatch();
  const demoData = useSelector((state: RootState) => state.demo.data);

  //   dispatch(clearDemoData());
  return (
    <div>
      {demoData ? (
        <>
          <DemoGameSCreen />
        </>
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
}

export default Page;
