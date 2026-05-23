"use client";
import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CircleArrowLeft } from "@/app/icons/icons";
import { useSearchParams } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";
import { formatCountDown, resendTimer } from "@/app/utils/utils";
import { useForgotPassword, useVerifyResetOtp } from "@/lib/queries";
import LeftSide from "../forgot-password/leftSide";
import Link from "next/link";

function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(resendTimer);
  const [canResend, setCanResend] = useState(false);
  const { mutate: verifyResetOtp, isPending: loading } = useVerifyResetOtp();
  const { mutate: forgotPassword } = useForgotPassword();

  if (!email) {
    router.replace("/forgot-password");
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyResetOtp(
      { email: email?.toLowerCase().trim() || "", otp: otpCode },
      {
        onSuccess: () => {
          router.push(
            `/reset-password?email=${encodeURIComponent(
              email || ""
            )}&code=${encodeURIComponent(otpCode)}`
          );
        },
      }
    );
  };

  const handleResendOTP = () => {
    setCountdown(resendTimer);
    setCanResend(false);
    forgotPassword({ email: email || "" });
  };

  return (
    <Grid columns={{ initial: "1", md: "2" }} className="h-screen">
      <LeftSide />
      <Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
        <form onSubmit={handleVerify}>
          <div className="space-y-8">
            <Link href="/" className="lg:hidden ">
              <Image
                src="/icons/quizmoney-logo-blue.svg"
                alt="Quiz Money"
                width={100}
                height={55}
                priority
              />
            </Link>
            <div className="">
              <Flex
                align="center"
                gap="2"
                onClick={() => router.back()}
                className="cursor-pointer"
              >
                <CircleArrowLeft /> Back
              </Flex>
            </div>
            <Flex direction="column" gap="1">
              <Heading as="h2">Enter Reset Code</Heading>
              <Text className="text-neutral-600 ">
                We&apos;ve sent you an email with a reset code
              </Text>
            </Flex>
            <div>
              <Text className="text-neutral-600 ">
                Check your <b>inbox</b> or <b>spam</b> folder. OTP sent to{" "}
                <span className="text-secondary-900 underline underline-offset-2">
                  {email}.
                </span>
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
                    onValueChange={setOtpCode}
                    disabled={loading}
                  >
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.HiddenInput />
                  </OneTimePasswordField.Root>
                </div>
              </Flex>
            </div>
            <div>
              <Text className="text-neutral-600 ">
                Didn&apos;t get code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend}
                  className={`font-medium underline underline-offset-2 ${
                    canResend
                      ? "text-primary-900 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Resend Code
                </button>
                <span> • </span>
                <span>{formatCountDown(countdown)}</span>
              </Text>
            </div>

            <div className="pt-10 lg:pt-4">
              {!loading ? (
                <CustomButton
                  type="submit"
                  width="full"
                  disabled={otpCode.length !== 6}
                >
                  Verify Account
                </CustomButton>
              ) : (
                <CustomButton type="button" width="full" loader disabled />
              )}
            </div>
          </div>
        </form>
      </Container>
    </Grid>
  );
}

export default Page;
