"use client";
import React, { ReactNode, useEffect } from "react";
import { Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import EnablePushOnIosButton from "./pwa/iosNotificationRequest";
// import NotificationBanner from "./firebase/NotificationBanner";
import { Toaster } from "@/app/components/toaster/sonner";
import { useAppDispatch } from "./hooks/useAuth";
import { setRehydrated } from "./store/authSlice";
import useFcmToken from "./hooks/useFcmToken";
import { isIosPwaInstalled } from "./utils/utils";
import PermissionGuide from "./pwa/permissionGuide";

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

	return (
		<Theme appearance="light" className="!font-text">
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					{isVisible && !token && !isIosPwaInstalled() && <PermissionGuide />}
					<RootHydrationWatcher />
					<Toaster appearance="light" />
					<EnablePushOnIosButton />
					{children}
				</PersistGate>
			</Provider>
		</Theme>
	);
};

export default AppSetup;
