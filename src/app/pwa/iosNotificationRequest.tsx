"use client";
import React, { useEffect, useState } from "react";
import { fetchToken } from "@/app/firebase/firebase";
import { isIosPwaInstalled } from "../utils/utils";
import { Button, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function EnablePushOnIosButton() {
	const [isVisible, setIsVisible] = useState(false);
	const [isPushEnabled, setIsPushEnabled] = useState(false);
	const [status, setStatus] = useState("Tap to enable push notifications");

	useEffect(() => {
		if (!isIosPwaInstalled()) return;

		setIsVisible(true);

		const checkPermission = () => {
			const permission = Notification.permission;
			if (permission === "granted") {
				setStatus("✅ Push already enabled!");
				setIsPushEnabled(true);
			} else if (permission === "denied") {
				setStatus("❌ Notifications blocked");
				setIsPushEnabled(false);
			} else {
				setStatus("Tap to enable push notifications");
				setIsPushEnabled(false);
			}
		};

		checkPermission();
		const interval = setInterval(checkPermission, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleClick = async () => {
		if (!isIosPwaInstalled()) return;

		try {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				const token = await fetchToken();
				console.log("✅ Push token:", token);
				setStatus("✅ Push enabled!");
				setIsPushEnabled(true);
			} else if (permission === "denied") {
				setStatus("❌ Permission denied");
				setIsPushEnabled(false);
			}
		} catch (err) {
			console.error("Push setup error:", err);
			setStatus("⚠️ Something went wrong");
		}
	};

	if (!isVisible || isPushEnabled) return null;

	return (
		<Callout.Root>
			<Callout.Icon>
				<InfoCircledIcon />
			</Callout.Icon>
			<Callout.Text className="flex flex-col gap-3">
				<span>
					🔔 Notifications are required to participate in{" "}
					<span className="font-bold">Quiz Money</span>!
				</span>
				<Button onClick={handleClick}>{status}</Button>
			</Callout.Text>
		</Callout.Root>
	);
}
