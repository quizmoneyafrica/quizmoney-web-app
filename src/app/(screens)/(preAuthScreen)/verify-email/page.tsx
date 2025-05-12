"use client";
import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";
import { formatCountDown, resendTimer, toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import UserAPI from "@/app/api/userApi";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { encryptData } from "@/app/utils/crypto";

function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const router = useRouter();
	const { loginUser } = useAuth();
	const [countdown, setCountdown] = useState(resendTimer);
	const [canResend, setCanResend] = useState(false);
	const [loading, setLoading] = React.useState(false);

	const [otpCode, setOtpCode] = useState("");

	if (!email) {
		router.replace("/signup");
	}

	useEffect(() => {
		if (countdown <= 0) {
			setCanResend(true);
			return;
		}

		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown]);

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const newValues = {
			email: email?.toLowerCase().trim() || "",
			otp: otpCode,
		};
		try {
			const response = await UserAPI.verifyEmail(newValues);
			const userData = response.data.result.verifiedUser;

			console.log("Verify Signup:", userData);

			// 🔐 Encrypt the user data
			const encryptedUser = encryptData(userData);
			console.log("Encrypted: ", encryptedUser);

			// ✅ Dispatch to Redux
			loginUser(encryptedUser);

			// router.replace("/home");
			router.replace("/account-created");

			// toast.success(
			// 	`Welcome Back ${capitalizeFirstLetter(userData?.firstName)}`,
			// 	{
			// 		position: "top-center",
			// 	}
			// );
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setLoading(false);
			toast.error(`${err.response.data.error}`, {
				position: toastPosition,
			});
		}
	};
	const handleResendOTP = async () => {
		setCountdown(resendTimer);
	};
	return (
		<>
			<Grid columns={{ initial: "1", md: "2" }} className="h-screen">
				<div className="hidden lg:inline-block">
					<div className="bg-primary-50 h-screen lg:h-full w-full p-4 lg:px-10 grid grid-cols-1 ">
						<Link href="/">
							<Flex align="center" justify="between">
								<Image
									src="/icons/quizmoney-logo-blue.svg"
									alt="Quiz Money"
									width={100}
									height={55}
									priority
								/>
							</Flex>
						</Link>

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
				<Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
					<form onSubmit={handleVerify}>
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
									<div className="w-full md:max-w-[50%] lg:max-w-[80%]">
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
										{/* <p className="text-error-500 mt-4">
											Incorrect OTP provided
										</p> */}
									</div>
								</Flex>
							</div>
							<div>
								<Text className="text-neutral-600 ">
									Didn&apos;t get code?{" "}
									<button
										type="button"
										onClick={handleResendOTP}
										className={`font-medium underline underline-offset-2 ${
											canResend
												? "text-primary-900 cursor-pointer"
												: "text-gray-400 cursor-not-allowed"
										}`}>
										Resend Code
									</button>
									<span> • </span>
									<span>{formatCountDown(countdown)}</span>
								</Text>
							</div>

							<div className="pt-10 lg:pt-4">
								{!loading ? (
									<CustomButton type="submit" width="full">
										Verify Account
									</CustomButton>
								) : (
									<CustomButton type="button" loader width="full" />
								)}
							</div>
						</div>
					</form>
				</Container>
			</Grid>
		</>
	);
}

export default VerifyEmailPage;
