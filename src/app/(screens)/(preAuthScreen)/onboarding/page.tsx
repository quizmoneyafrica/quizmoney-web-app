"use client";
import AppLoader from "@/app/components/loader/loader";
import Onboarding from "@/app/components/onboarding/onboarding";
import { useAppSelector } from "@/app/hooks/useAuth";
import { isMobileOrTablet } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function OnboardingPage() {
	const router = useRouter();
	const { isAuthenticated, rehydrated } = useAppSelector((s) => s.auth);
	const [deviceReady, setDeviceReady] = useState(false);

	useEffect(() => {
		if (rehydrated && isAuthenticated) {
			router.replace("/home");
		}
	}, [isAuthenticated, rehydrated, router]);

	useEffect(() => {
		if (rehydrated && !isMobileOrTablet()) {
			router.replace("/login");
		} else {
			setDeviceReady(true);
		}
	}, [rehydrated, router]);

	if (!rehydrated || !deviceReady) return <AppLoader />;

	return (
		<>
			<div className="overflow-hidden">
				<Onboarding />
			</div>
		</>
	);
}

export default OnboardingPage;
