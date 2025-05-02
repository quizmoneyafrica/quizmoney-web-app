"use client";
import AppLoader from "@/app/components/loader/loader";
import Onboarding from "@/app/components/onboarding/onboarding";
import { useAppSelector } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function OnboardingPage() {
	const router = useRouter();
	const { isAuthenticated, rehydrated } = useAppSelector((s) => s.auth);

	useEffect(() => {
		if (rehydrated && isAuthenticated) {
			router.replace("/home");
		}
	}, [isAuthenticated, rehydrated, router]);

	if (!rehydrated) return <AppLoader />;
	return (
		<>
			<div className="overflow-hidden">
				<Onboarding />
			</div>
		</>
	);
}

export default OnboardingPage;
