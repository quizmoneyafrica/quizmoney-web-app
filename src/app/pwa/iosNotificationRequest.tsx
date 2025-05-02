"use client";
import React, { useEffect, useState } from "react";
import { fetchToken } from "@/app/firebase/firebase";
import { isIosPwaInstalled } from "../utils/utils";
import { Button, Callout, Container } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import useFcmToken from "../hooks/useFcmToken";

export default function EnablePushOnIosButton() {
	const [isVisible, setIsVisible] = useState(false);
	const [isPushEnabled, setIsPushEnabled] = useState(false);
	const [status, setStatus] = useState("Tap to enable push notifications");
	const { notificationPermissionStatus } = useFcmToken();

	useEffect(() => {
		if (!isIosPwaInstalled()) return;

		setIsVisible(true);

		const checkPermission = () => {
			// const permission = Notification.permission;
			if (notificationPermissionStatus === "granted") {
				setStatus("✅ Push already enabled!");
				setIsPushEnabled(true);
			} else if (notificationPermissionStatus === "denied") {
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
	}, [notificationPermissionStatus]);

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
			} else {
				setStatus("Tap to enable push notifications");
			}
		} catch (err) {
			console.error("Push setup error:", err);
			setStatus("⚠️ Something went wrong");
		}
	};

	if (!isVisible || isPushEnabled) return null;

	return (
		<Container pb="2" px="2">
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
		</Container>
	);
}
