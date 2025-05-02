"use client";
import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/useAuth";
import AppLoader from "@/app/components/loader/loader";
import Image from "next/image";
import { CircleArrowLeft } from "@/app/icons/icons";
import { useSearchParams } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";

function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const router = useRouter();
	const { isAuthenticated, rehydrated } = useAppSelector((s) => s.auth);

	const [otpCode, setOtpCode] = useState("");

	useEffect(() => {
		if (rehydrated && isAuthenticated) {
			router.replace("/home");
		}
	}, [isAuthenticated, rehydrated, router]);

	if (!rehydrated) return <AppLoader />;

	if (!email) {
		router.replace("/login");
	}

	const handleVerify = () => {};
	return (
		<>
			<Grid columns={{ initial: "1", lg: "2" }} className="h-screen">
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
										src="/assets/images/mail.png"
										alt="Quiz Money Verify Email"
										width={300}
										height={300}
										className="mb-6"
									/>
								</div>
								<h2 className="text-xl font-heading font-semibold mb-2">
									Email Verification
								</h2>
								<p className="font-text text-gray-600 md:max-w-[70%] mx-auto">
									Verify your Email before your account is successfully created
								</p>
							</div>
						</div>
					</div>
				</div>
				<form onSubmit={handleVerify}>
					<Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
						<div className="space-y-8">
							<div className="hidden ">
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
							<Flex direction="column">
								<Heading as="h2">Verify Email</Heading>
								<Text className="text-neutral-600 ">
									Your&apos;re almost there 😎
								</Text>
							</Flex>
							<div>
								<Text className="text-neutral-600 ">
									Please enter the 6-digit code sent to your email{" "}
									<span className="text-secondary-900 underline underline-offset-2">
										{email}
									</span>{" "}
									for verification
								</Text>
							</div>
							<div>
								<Flex direction="column" gap="4">
									<Heading as="h3" size="4" weight="medium">
										Enter OTP Code
									</Heading>
									<div className="w-full lg:max-w-[80%]">
										<OneTimePasswordField.Root
											className="OTPRoot"
											name="otp"
											value={otpCode}
											autoComplete="one-time-code"
											onValueChange={setOtpCode}>
											<OneTimePasswordField.Input className="OTPInput" />
											<OneTimePasswordField.Input className="OTPInput" />
											<OneTimePasswordField.Input className="OTPInput" />
											<OneTimePasswordField.Input className="OTPInput" />
											<OneTimePasswordField.Input className="OTPInput" />
											<OneTimePasswordField.Input className="OTPInput" />
											<OneTimePasswordField.HiddenInput />
										</OneTimePasswordField.Root>
										<p className="text-error-500 mt-4">
											Incorrect OTP provided
										</p>
									</div>
								</Flex>
							</div>
							<div>
								<Text className="text-neutral-600 ">
									Didn&apos;t get code?{" "}
									<span className="text-primary-900 font-medium underline underline-offset-2">
										Resend Code
									</span>
									<span> • </span>
									<span>01:22</span>
								</Text>
							</div>

							<div className="pt-10 lg:pt-4">
								<CustomButton type="submit" width="full">
									Verify Account
								</CustomButton>
							</div>
						</div>
					</Container>
				</form>
			</Grid>
		</>
	);
}

export default VerifyEmailPage;
