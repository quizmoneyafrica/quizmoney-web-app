"use client";

import { useEffect, useRef, useState } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { fetchToken, messaging } from "@/app/firebase/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function getNotificationPermissionAndToken() {
	// Step 1: Check if Notifications are supported in the browser.
	if (!("Notification" in window)) {
		console.info("This browser does not support desktop notification");
		return null;
	}

	// Step 2: Check if permission is already granted.
	if (Notification.permission === "granted") {
		return await fetchToken();
	}

	// Step 3: If permission is not denied, request permission from the user.
	if (Notification.permission !== "denied") {
		const permission = await Notification.requestPermission();
		if (permission === "granted") {
			return await fetchToken();
		}
	}

	console.log("Notification permission not granted.");
	return null;
}
declare global {
	interface Navigator {
		standalone?: boolean;
	}
}
const useFcmToken = () => {
	const router = useRouter(); // Initialize the router for navigation.
	const [notificationPermissionStatus, setNotificationPermissionStatus] =
		useState<NotificationPermission | null>(null); // State to store the notification permission status.
	const [token, setToken] = useState<string | null>(null); // State to store the FCM token.
	const retryLoadToken = useRef(0); // Ref to keep track of retry attempts.
	const isLoading = useRef(false); // Ref to keep track if a token fetch is currently in progress.

	const loadToken = async () => {
		// Step 4: Prevent multiple fetches if already fetched or in progress.
		if (isLoading.current) return;

		isLoading.current = true; // Mark loading as in progress.
		const token = await getNotificationPermissionAndToken(); // Fetch the token.

		// Step 5: Handle the case where permission is denied.
		if (Notification.permission === "denied") {
			setNotificationPermissionStatus("denied");
			console.info(
				"%cPush Notifications issue - permission denied",
				"color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
			);
			isLoading.current = false;
			return;
		}

		// Step 6: Retry fetching the token if necessary. (up to 3 times)
		// This step is typical initially as the service worker may not be ready/installed yet.

		if (token) {
			setToken(token);
			setNotificationPermissionStatus("granted");
			console.info(
				"%cPush Notifications enabled",
				"color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
			);
		} else {
			// Handle the case where permission is not granted and token is not fetched.
			retryLoadToken.current++;
			if (retryLoadToken.current < 3) {
				setTimeout(loadToken, 1000); // Retry after 1 second.
			} else {
				console.error("Failed to fetch FCM token after 3 retries.");
			}
		}

		// Step 7: Set the fetched token and mark as fetched.
		setNotificationPermissionStatus(Notification.permission);
		setToken(token);
		isLoading.current = false;
	};

	useEffect(() => {
		// Step 8: Initialize token loading when the component mounts.
		if ("Notification" in window) {
			loadToken();
		}
	});

	useEffect(() => {
		const setupListener = async () => {
			if (!token) return; // Exit if no token is available.

			console.log(`onMessage registered with token ${token}`);
			const m = await messaging();
			if (!m) return;

			// Step 9: Register a listener for incoming FCM messages.
			const unsubscribe = onMessage(m, (payload) => {
				if (Notification.permission !== "granted") return;

				console.log("Foreground push notification received:", payload);
				const link = payload.fcmOptions?.link || payload.data?.link;

				if (link) {
					toast.info(
						`${payload.notification?.title}: ${payload.notification?.body}`,
						{
							action: {
								label: "Visit",
								onClick: () => {
									const link = payload.fcmOptions?.link || payload.data?.link;
									if (link) {
										router.push(link);
									}
								},
							},
							duration: 10000,
							position: "top-center",
						}
					);
				} else {
					toast.info(
						`${payload.notification?.title}: ${payload.notification?.body}`,
						{
							duration: 10000,
							position: "top-center",
						}
					);
				}

				// --------------------------------------------
				// Disable this if you only want toast notifications.
				// const n = new Notification(
				// 	payload.notification?.title || "New message",
				// 	{
				// 		body: payload.notification?.body || "This is a new message",
				// 		data: link ? { url: link } : undefined,
				// 	}
				// );

				// Step 10: Handle notification click event to navigate to a link if present.
				// n.onclick = (event) => {
				// 	event.preventDefault();
				// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
				// 	const link = (event.target as any)?.data?.url;
				// 	if (link) {
				// 		router.push(link);
				// 	} else {
				// 		console.log("No link found in the notification payload");
				// 	}
				// };
				// --------------------------------------------
			});

			return unsubscribe;
		};

		// Step 11: Cleanup the listener when the component unmounts.
		let unsubscribe: Unsubscribe | null = null;

		setupListener().then((unsub) => {
			if (unsub) {
				unsubscribe = unsub;
			}
		});

		return () => unsubscribe?.();
	}, [token, router /*, toast*/]);

	return { token, notificationPermissionStatus }; // Return the token and permission status.
};

export default useFcmToken;
