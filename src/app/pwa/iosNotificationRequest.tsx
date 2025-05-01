"use client";
import React, { useEffect, useState } from "react";
import { fetchToken } from "@/app/firebase/firebase";
import { isIosPwaInstalled } from "../utils/utils";

export default function EnablePushOnIosButton() {
	const [isVisible, setIsVisible] = useState(false);
	const [status, setStatus] = useState("Tap to enable push notifications");

	useEffect(() => {
		if (!isIosPwaInstalled()) return;

		setIsVisible(true); // Now it's safe to show

		const checkPermission = () => {
			const permission = Notification.permission;
			if (permission === "granted") {
				setStatus("✅ Push already enabled!");
			} else if (permission === "denied") {
				setStatus("❌ Notifications blocked");
			} else {
				setStatus("Tap to enable push notifications");
			}
		};

		checkPermission();
		const interval = setInterval(checkPermission, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleClick = async () => {
		if (!isIosPwaInstalled()) return; // extra safety

		try {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				const token = await fetchToken();
				console.log("✅ Push token:", token);
				setStatus("✅ Push enabled!");
			} else if (permission === "denied") {
				setStatus("❌ Permission denied");
			}
		} catch (err) {
			console.error("Push setup error:", err);
			setStatus("⚠️ Something went wrong");
		}
	};

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-400 p-4 z-50 shadow-md text-center text-sm md:text-base">
			<p className="mb-2 text-yellow-900 font-medium">
				🔔 Notifications are required to participate in Quiz Money!
			</p>
			<p className="mb-4 text-yellow-800">
				Please enable notifications so we can alert you before each live game.
			</p>

			<button
				onClick={handleClick}
				className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg">
				{status}
			</button>
		</div>
	);
}
