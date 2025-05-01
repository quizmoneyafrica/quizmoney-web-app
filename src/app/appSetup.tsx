"use client";
import React, { ReactNode } from "react";
import { Theme } from "@radix-ui/themes";
import useFcmToken from "./hooks/useFcmToken";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import EnablePushOnIosButton from "./pwa/iosNotificationRequest";
import NotificationBanner from "./firebase/NotificationBanner";
import { Toaster } from "@/app/components/splashScreen/toaster/sonner";

type Props = {
	children: ReactNode;
};

const AppSetup = ({ children }: Props) => {
	const { token, notificationPermissionStatus } = useFcmToken();
	// const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
	return (
		<Theme appearance="light">
			<div className="text-red-600 p-4 overflow-ellipsis">
				<h1 className="text-4xl mb-4 font-bold">
					Firebase Cloud Messaging Demo
				</h1>
				{notificationPermissionStatus === "granted" ? (
					<p>
						Permission to receive notifications has been granted. Token: {token}
					</p>
				) : notificationPermissionStatus !== null ? (
					<p>
						You have not granted permission to receive notifications. Please
						enable notifications in your browser settings.
					</p>
				) : null}
			</div>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Toaster appearance="light" />
					<EnablePushOnIosButton />
					<NotificationBanner />
					{children}
				</PersistGate>
			</Provider>
		</Theme>
	);
};

export default AppSetup;
