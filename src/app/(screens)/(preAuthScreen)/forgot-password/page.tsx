"use client";
import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CircleArrowLeft, MailIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import { isValidEmail } from "@/app/utils/utils";
import CustomTextField from "@/app/utils/CustomTextField";
import Link from "next/link";
import { useForgotPassword } from "@/lib/queries";
import LeftSide from "./leftSide";

function Page() {
  const [emailAddress, setEmailAddress] = useState("");
  const router = useRouter();
  const { mutate: forgotPassword, isPending: loading } = useForgotPassword();

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(
      { email: emailAddress },
      {
        onSuccess: () => {
          router.push(
            `/verify-forgot-password?email=${encodeURIComponent(emailAddress)}`
          );
        },
      }
    );
  };

  return (
    <Grid columns={{ initial: "1", md: "2" }} className="h-screen">
      <LeftSide />
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
                className="cursor-pointer"
              >
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
                  disabled={!isValidEmail(emailAddress)}
                >
                  Send Verification Code
                </CustomButton>
              ) : (
                <CustomButton type="button" width="full" loader disabled />
              )}

              <Flex align="center" justify="center">
                <Link
                  href="/login"
                  className="inline-block font-medium underline underline-offset-2 text-primary-900 text-center"
                >
                  Login instead
                </Link>
              </Flex>
            </Flex>
          </div>
        </form>
      </Container>
    </Grid>
  );
}

export default Page;
