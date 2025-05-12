"use client";
import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import Onboarding from "../../../components/onboarding/onboarding";
import LoginForm from "./loginForm";
import Image from "next/image";

const LoginPage = () => {
	const [loading, setLoading] = useState(false);
	
	return (
		<>
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
						<Flex direction="column" gap="1">
							<Heading as="h2">Welcome Back!</Heading>
							<Text className="text-neutral-600 ">Time to quiz and win</Text>
						</Flex>

						<Container>
							<LoginForm loading={loading} setLoading={setLoading} />
						</Container>
					</div>
				</Container>
			</Grid>
		</>
	);
};
export default LoginPage;
