"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	useEffect(() => {
		router.prefetch("/home");
		router.prefetch("/wallet");
		router.prefetch("/store");
		router.prefetch("/leaderboard");
		router.prefetch("/settings");
	});
	return <>{children}</>;
}
