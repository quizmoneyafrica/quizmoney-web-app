"use client";
import { Container, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useEffect } from "react";
import Onboarding from "../../../components/onboarding/onboarding";
import LoginForm from "./loginForm";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/useAuth";
import AppLoader from "@/app/components/loader/loader";

type Props = {
	appName?: string;
};

const LoginPage = ({}: Props) => {
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
			<Grid columns={{ initial: "1", lg: "2" }} className="h-screen">
				<div className="hidden lg:inline-block">
					<Onboarding />
				</div>
				<Container className="flex items-center justify-center px-4 ">
					<div>
						<Container>
							<Heading as="h2">Welcome Back!</Heading>
							<Text className="text-neutral-600 ">Time to quiz and win</Text>
						</Container>

						<Container>
							<LoginForm />
						</Container>

						<Container></Container>
					</div>
				</Container>
			</Grid>
		</>
	);
};
export default LoginPage;
