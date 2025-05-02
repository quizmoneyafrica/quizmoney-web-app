"use client";
import React, { ReactNode, useEffect } from "react";
import { Callout, Theme } from "@radix-ui/themes";
import useFcmToken from "./hooks/useFcmToken";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import EnablePushOnIosButton from "./pwa/iosNotificationRequest";
// import NotificationBanner from "./firebase/NotificationBanner";
import { Toaster } from "@/app/components/toaster/sonner";
import { BellIcon, Link2Icon } from "@radix-ui/react-icons";
import AppLayout from "./layout/appLayout";
import Link from "next/link";
import { useAppDispatch } from "./hooks/useAuth";
import { setRehydrated } from "./store/authSlice";

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
	const { notificationPermissionStatus } = useFcmToken();
	// const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

	return (
		<Theme appearance="light" className="!font-text">
			<AppLayout>
				{notificationPermissionStatus ===
				"granted" ? null : notificationPermissionStatus !== null ? ( // </p> // 	Permission to receive notifications has been granted. Token: {token} // <p>
					<Callout.Root color="red">
						<Callout.Icon>
							<BellIcon />
						</Callout.Icon>
						<Callout.Text className="flex flex-col gap-2">
							<span>
								You have not granted permission to receive notifications. Please
								enable notifications in your browser settings.
							</span>
							<Link
								className="underline font-bold flex items-center gap-1"
								href="https://quizmoney.ng/enable-notification/"
								target="_blank">
								<Link2Icon /> Click to see how
							</Link>
						</Callout.Text>
					</Callout.Root>
				) : null}
			</AppLayout>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
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
