"use client";
import React, { useEffect, useState } from "react";
import { isSupported } from "firebase/messaging";

const NotificationBanner = () => {
	const [shouldShowBanner, setShouldShowBanner] = useState(false);

	useEffect(() => {
		const checkNotificationStatus = async () => {
			const supported = await isSupported();

			if (!supported) {
				setShouldShowBanner(false);
				return;
			}

			const permission = Notification.permission;
			if (permission === "granted") {
				setShouldShowBanner(false);
			} else if (permission === "denied") {
				setShouldShowBanner(true);
			}
		};

		checkNotificationStatus();

		// Re-check every 5 seconds to auto-dismiss if status changes in browser
		const interval = setInterval(checkNotificationStatus, 5000);

		return () => clearInterval(interval);
	}, []);

	if (!shouldShowBanner) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-400 p-4 z-50 shadow-md text-center text-sm md:text-base">
			<p className="mb-2 text-yellow-900 font-medium">
				🔔 Notifications are required to participate in Quiz Money!
			</p>
			<p className="mb-4 text-yellow-800">
				Please enable notifications so we can alert you before each live game.
			</p>
			<a
				href="https://quizmoney.ng/enable-notification/"
				target="_blank"
				className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg">
				Enable Notifications
			</a>
		</div>
	);
};

export default NotificationBanner;
