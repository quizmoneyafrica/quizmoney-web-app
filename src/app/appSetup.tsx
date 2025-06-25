"use client";
import React, { ReactNode, useEffect } from "react";
import { Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import EnablePushOnIosButton from "./pwa/iosNotificationRequest";
import { Toaster } from "@/app/components/toaster/sonner";
import { useAppDispatch } from "./hooks/useAuth";
import { setRehydrated } from "./store/authSlice";
import useFcmToken from "./hooks/useFcmToken";
import { disableConsoleInProduction, isIosPwaInstalled } from "./utils/utils";
import PermissionGuide from "./pwa/permissionGuide";
import AudioManager from "./(screens)/(liveGame)/live-game/cmp/GameAudioManager";
import { isMobile } from "react-device-detect";

type Props = {
  children: ReactNode;
};

function RootHydrationWatcher() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setRehydrated(true));
  }, [dispatch]);

  return null;
}

const AppSetup = ({ children }: Props) => {
  // const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const { token, notificationPermissionStatus } = useFcmToken();

  const isVisible =
    notificationPermissionStatus === "default" ||
    notificationPermissionStatus === "denied";
  useEffect(() => {
    disableConsoleInProduction();
    window.scrollTo(0, 0);
    const viewport = document.querySelector("meta[name=viewport]");
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1"
      );
    }
  }, []);
  // useEffect(() => {
  //   if (!isMobile) {
  //     let devtoolsOpen = false;

  //     const threshold = 160;
  //     const check = () => {
  //       const widthThreshold =
  //         window.outerWidth - window.innerWidth > threshold;
  //       const heightThreshold =
  //         window.outerHeight - window.innerHeight > threshold;
  //       if (widthThreshold || heightThreshold) {
  //         devtoolsOpen = true;
  //       }
  //     };

  //     setInterval(() => {
  //       check();
  //       if (devtoolsOpen) {
  //         window.location.href = "/blocked";
  //       }
  //     }, 1000);
  //   }
  // }, []);

  return (
    <Theme appearance="light" className="!font-text">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {isVisible && !token && !isIosPwaInstalled() && <PermissionGuide />}
          <RootHydrationWatcher />
          <Toaster appearance="light" />
          <EnablePushOnIosButton />
          <AudioManager />
          {children}
        </PersistGate>
      </Provider>
    </Theme>
  );
};

export default AppSetup;
