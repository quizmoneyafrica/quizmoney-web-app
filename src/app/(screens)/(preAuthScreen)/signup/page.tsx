"use client";
import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import Onboarding from "../../../components/onboarding/onboarding";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/useAuth";
import AppLoader from "@/app/components/loader/loader";
import Image from "next/image";
import SignupForm from "./signupForm";
import { CircleArrowLeft } from "@/app/icons/icons";

function SignUpPage() {
	const router = useRouter();
	const { isAuthenticated, rehydrated } = useAppSelector((s) => s.auth);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (rehydrated && isAuthenticated) {
			router.replace("/home");
		}
	}, [isAuthenticated, rehydrated, router]);

	if (!rehydrated) return <AppLoader />;
	return (
		<>
			{loading && <AppLoader />}
			<Grid columns={{ initial: "1", md: "2" }} className="h-screen">
				<div className="hidden lg:inline-block">
					<Onboarding />
				</div>
				<Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
					<div className="space-y-8">
						<div className="lg:hidden ">
							<Image
								src="/icons/quizmoney-logo-blue.svg"
								alt="Quiz Money"
								width={100}
								height={55}
								priority
							/>
						</div>
						<div className="hidden lg:inline-flex">
							<Flex
								align="center"
								gap="2"
								onClick={() => router.back()}
								className="cursor-pointer">
								<CircleArrowLeft /> Back
							</Flex>
						</div>
						<Flex direction="column" gap="1">
							<Heading as="h2">Sign Up</Heading>
							<Text className="text-neutral-600 ">
								Let&apos;s create your account
							</Text>
						</Flex>

						<Container>
							<SignupForm setLoading={setLoading} />
						</Container>
					</div>
				</Container>
			</Grid>
		</>
	);
}

export default SignUpPage;
