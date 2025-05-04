"use client";
import React, { ReactNode, useEffect } from "react";
import { Callout, Container, Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import EnablePushOnIosButton from "./pwa/iosNotificationRequest";
// import NotificationBanner from "./firebase/NotificationBanner";
import { Toaster } from "@/app/components/toaster/sonner";
import { BellIcon, Link2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useAppDispatch } from "./hooks/useAuth";
import { setRehydrated } from "./store/authSlice";
import useFcmToken from "./hooks/useFcmToken";

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
	const { notificationPermissionStatus } = useFcmToken();

	const isVisible =
		notificationPermissionStatus === "default" ||
		notificationPermissionStatus === "denied";

	return (
		<Theme appearance="light" className="!font-text">
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					{isVisible && (
						<Container py="2" px="2">
							<Callout.Root color="red">
								<Callout.Icon>
									<BellIcon />
								</Callout.Icon>
								<Callout.Text className="flex flex-col gap-2">
									<span>
										You have not granted permission to receive notifications.
										Please enable notifications in your browser settings.
									</span>
									<Link
										className="underline font-bold flex items-center gap-1"
										href="https://quizmoney.ng/enable-notification/"
										target="_blank">
										<Link2Icon /> Click to see how
									</Link>
								</Callout.Text>
							</Callout.Root>
						</Container>
					)}
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
