/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useLogin, useResendOtp } from "@/lib/queries";
import NLRC from "@/app/components/follow/nlrc";
import SocialFollow from "@/app/components/follow/socialFollow";
import useFcmToken from "@/app/hooks/useFcmToken";
import { EyeIcon, EyeSlash, MailIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import { isValidEmail, toastPosition } from "@/app/utils/utils";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { notificationPermissionStatus } = useFcmToken();
  const { mutate: login, isPending } = useLogin();
  const { mutate: resendOtp } = useResendOtp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      notificationPermissionStatus &&
      notificationPermissionStatus !== "granted"
    ) {
      toast.info("Notification is not set for Quiz Money", {
        position: toastPosition,
      });
    }
    if (!email || !password) {
      toast.error("Email and password are required.", {
        position: toastPosition,
      });
      return;
    }

    login(
      { email: email.toLowerCase().trim(), password },
      {
        onSuccess: () => router.replace("/home"),
        onError: (error: any) => {
          console.log("LOGIN ERROR:", error);
          console.log("RESPONSE:", error?.response);

          const message =
            error?.response?.data?.message ?? error?.message ?? "";
          if (message === "Account deactivated") {
            resendOtp(
              {
                email: email.toLowerCase().trim(),
                purpose: "email_verification",
              },
              {
                onSuccess: () => {
                  router.push(
                    `/verify-email?email=${encodeURIComponent(email.toLowerCase().trim())}`,
                  );
                  toast.error("Please verify your account to continue.", {
                    position: toastPosition,
                  });
                },
              },
            );
          }
        },
      },
    );
  };

  return (
    <form onSubmit={handleLogin}>
      <Flex direction="column" gap="4">
        <CustomTextField
          label="Email"
          name="email"
          value={email}
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          icon={<MailIcon className="text-[#A6ABC4]" />}
          disabled={isPending}
        />
        <CustomTextField
          label="Password"
          name="password"
          value={password}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          icon={
            showPassword ? (
              <EyeIcon
                className="text-[#A6ABC4]"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeSlash
                className="text-[#A6ABC4]"
                onClick={() => setShowPassword(true)}
              />
            )
          }
          disabled={isPending}
        />

        <Flex justify="end">
          <Link
            href="/forgot-password"
            className="underline underline-offset-4 text-primary-900"
          >
            Forgot your password?
          </Link>
        </Flex>
        <div className="pt-4 w-full">
          {!isPending ? (
            <CustomButton
              type="submit"
              width="full"
              disabled={!isValidEmail(email) || password === ""}
            >
              Login
            </CustomButton>
          ) : (
            <CustomButton
              type="button"
              width="full"
              loader
              disabled
            ></CustomButton>
          )}
        </div>
        <div className="py-4 space-y-6">
          <p className="text-center pb-3">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="text-primary-900 font-medium underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
          <SocialFollow />
          <NLRC />
        </div>
      </Flex>
    </form>
  );
};
export default LoginForm;

type IconButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

export function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-[#ECECEC] hover:bg-[#e2e1e1] cursor-pointer py-3 px-8 rounded-[10px] transition"
    >
      {children}
    </button>
  );
}
