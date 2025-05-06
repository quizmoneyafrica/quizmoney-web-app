"use client";
import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/useAuth";
import AppLoader from "@/app/components/loader/loader";
import Image from "next/image";
import { CircleArrowLeft, MailIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import { isValidEmail, toastPosition } from "@/app/utils/utils";
import CustomTextField from "@/app/utils/CustomTextField";
import Link from "next/link";
import UserAPI from "@/app/api/userApi";
import { toast } from "sonner";

function Page() {
	const [emailAddress, setEmailAddress] = useState("");
	const router = useRouter();
	const { isAuthenticated, rehydrated } = useAppSelector((s) => s.auth);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (rehydrated && isAuthenticated) {
			router.replace("/home");
		}
	}, [isAuthenticated, rehydrated, router]);

	if (!rehydrated) return <AppLoader />;

	const handleForgot = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await UserAPI.forgotPassword(emailAddress);
			console.log("Forgot Password:", response);

			router.push(
				`/verify-forgot-password?email=${encodeURIComponent(emailAddress)}`
			);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log("ERROR Forgot Password", err);
			toast.error(`${err.response.data.error}`, {
				position: toastPosition,
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<Grid columns={{ initial: "1", md: "2" }} className="h-screen">
				<div className="hidden lg:inline-block">
					<div className="bg-primary-50 h-screen lg:h-full w-full p-4 lg:px-10 grid grid-cols-1 ">
						<div>
							<Flex align="center" justify="between">
								<Image
									src="/icons/quizmoney-logo-blue.svg"
									alt="Quiz Money"
									width={100}
									height={55}
									priority
								/>
							</Flex>
						</div>

						<div>
							<div className="flex-col items-center justify-between text-center px-4 pt-4">
								<div className="flex items-center justify-center">
									<Image
										src="/assets/images/reset-password.png"
										alt="Quiz Money Verify Email"
										width={300}
										height={300}
										className="mb-6"
									/>
								</div>
								<h2 className="text-xl font-heading font-semibold mb-2">
									Reset Your Password
								</h2>
								<p className="font-text text-gray-600 md:max-w-[70%] mx-auto">
									Don&apos;t worry you can reset your password with ease
								</p>
							</div>
						</div>
					</div>
				</div>
				<Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
					<form onSubmit={handleForgot}>
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
							<div className="">
								<Flex
									align="center"
									gap="2"
									onClick={() => router.back()}
									className="cursor-pointer">
									<CircleArrowLeft /> Back
								</Flex>
							</div>
							<Flex direction="column" gap="1">
								<Heading as="h2">
									Oops!
									<br /> Forgot your Password?
								</Heading>
								<Text className="text-neutral-600 ">
									No worries, let&apos;s get you back in the game. Enter your
									email for password reset code.
								</Text>
							</Flex>
							<Flex direction="column" gap="8">
								<CustomTextField
									label="Email"
									name="email"
									value={emailAddress}
									type="email"
									autoComplete="email"
									placeholder="Enter your email"
									onChange={(e) => setEmailAddress(e.target.value)}
									icon={<MailIcon className="text-[#A6ABC4]" />}
									disabled={loading}
								/>

								{!loading ? (
									<CustomButton
										type="submit"
										width="full"
										disabled={!isValidEmail(emailAddress)}>
										Send Verification Code
									</CustomButton>
								) : (
									<CustomButton type="button" width="full" loader disabled />
								)}

								<Flex align="center" justify="center">
									<Link
										href="/login"
										className="inline-block font-medium underline underline-offset-2 text-primary-900 text-center">
										Login instead
									</Link>
								</Flex>
							</Flex>
						</div>
					</form>
				</Container>
			</Grid>
		</>
	);
}

export default Page;
