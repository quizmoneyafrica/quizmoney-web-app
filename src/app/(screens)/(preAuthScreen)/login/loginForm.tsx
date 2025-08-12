/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import UserAPI from "@/app/api/userApi";
import NLRC from "@/app/components/follow/nlrc";
import SocialFollow from "@/app/components/follow/socialFollow";
import { useAuth } from "@/app/hooks/useAuth";
import useFcmToken from "@/app/hooks/useFcmToken";
import { EyeIcon, EyeSlash, MailIcon } from "@/app/icons/icons";
import getDeviceId from "@/app/pwa/deviceId";
import { decryptData } from "@/app/utils/crypto";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import {
  capitalizeFirstLetter,
  isValidEmail,
  toastPosition,
} from "@/app/utils/utils";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ loading, setLoading }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { token, notificationPermissionStatus } = useFcmToken();
  const { loginUser, updateCustomer } = useAuth();
  const router = useRouter();
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("/api/app-info");
        const data = await res.json();
        setIpAddress(decryptData(data));
      } catch (err) {
        console.error("Could not fetch IP:", err);
      }
    };

    fetchIP();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      notificationPermissionStatus &&
      notificationPermissionStatus !== "granted"
    ) {
      toast.info(`Notification is not set for Quiz Money`, {
        position: toastPosition,
      });
    }
    if (!email || !password) {
      toast.error(`Email and password are required.`, {
        position: toastPosition,
      });
      setLoading(false);
      return;
    }
    const deviceId = getDeviceId();
    const newValues = {
      username: email.toLowerCase().trim(),
      password: password,
      deviceToken: token || email.toLowerCase().trim() + password,
      deviceId: deviceId,
      ipAddress: ipAddress,
    };
    try {
      const res = await UserAPI.login(newValues);
      console.log("RES", res);
      const data = await UserAPI.customerProfile(res.data.accessToken);
      console.log("Customer Profile", data);
      if (res.success) {
        loginUser(res.data);
        if (data.data) {
          updateCustomer(data.data);
          router.replace("/home");
          toast.success(
            `Welcome Back ${capitalizeFirstLetter(res.data.user.firstName)}`,
            {
              position: "top-center",
            }
          );
        }
      }
    } catch (err: any) {
      console.log("INVALID", err.raw);
      if (err.message === "Account deactivated") {
        localStorage.setItem("login", JSON.stringify(newValues));
        verifyEmail(email.toLowerCase().trim());
      } else {
        toast.error(`${err.message}`, {
          position: toastPosition,
        });
        if (err.data.errorList) {
          toast.error(`${err.data.errorList[0]}`, {
            position: toastPosition,
          });
        }
      }
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string) => {
    try {
      await UserAPI.resendSignupOtp(email);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      toast.error("Please verify your account to continue.", {
        position: toastPosition,
      });
    } catch (err: any) {
      console.log("ERROR Forgot Password", err);
      toast.error(`${err.message}`, {
        position: toastPosition,
      });
      setLoading(false);
    }
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
          disabled={loading}
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
          disabled={loading}
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
          {!loading ? (
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
