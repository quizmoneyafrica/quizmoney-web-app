"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import AppLoader from "../loader/loader";

export default function RehydrationGuard({
	children,
}: {
	children: React.ReactNode;
}) {
	const rehydrated = useAppSelector((s) => s.auth.rehydrated);

	if (!rehydrated) {
		return <AppLoader />;
	}

	return <>{children}</>;
}
