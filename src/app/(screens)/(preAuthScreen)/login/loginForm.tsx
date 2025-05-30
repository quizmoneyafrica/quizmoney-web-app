"use client";
import UserAPI from "@/app/api/userApi";
import { useAuth } from "@/app/hooks/useAuth";
import useFcmToken from "@/app/hooks/useFcmToken";
import {
  EyeIcon,
  EyeSlash,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  XIcon,
} from "@/app/icons/icons";
import getDeviceId from "@/app/pwa/deviceId";
import { encryptData } from "@/app/utils/crypto";
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
import React, { useState } from "react";
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
  const { loginUser } = useAuth();
  const router = useRouter();

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
      email: email.toLowerCase().trim(),
      password: password,
      deviceToken: token || "",
      deviceId: deviceId,
    };
    try {
      const response = await UserAPI.login(newValues);
      const userData = response.data.result;

      if (userData?.emailVerified) {
        // Encrypt the user data
        const encryptedUser = encryptData(userData);

        // Dispatch to Redux
        loginUser(encryptedUser);

        router.replace("/home");

        toast.success(
          `Welcome Back ${capitalizeFirstLetter(userData?.firstName)}`,
          {
            position: "top-center",
          }
        );
      } else {
        sessionStorage.setItem("pass", password);
        verifyEmail(userData?.email, userData?.firstName);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    }
  };
  // const handleGoogleAuth = () => {
  //   toast.info("Google Sign in Coming soon", {
  //     position: toastPosition,
  //     icon: <GoogleIcon />,
  //   });
  // };
  // const handleFacebookAuth = () => {
  //   toast.info("Facebook Sign in Coming soon", {
  //     position: toastPosition,
  //     icon: <FacebookIcon />,
  //   });
  // };
  // const handleAppleAuth = () => {
  //   toast.info("Apple Sign in Coming soon", {
  //     position: toastPosition,
  //     icon: <AppleIcon />,
  //   });
  // };

  const verifyEmail = async (email: string, firstName: string) => {
    try {
      const response = await UserAPI.resendSignupOtp(email);
      if (response.status === 200) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        toast.error(
          `${capitalizeFirstLetter(firstName)} please verify your email.`,
          {
            position: "top-center",
          }
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("ERROR Forgot Password", err);
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    }
  };
  return (
    <>
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
              <CustomButton type="button" width="full" loader disabled />
            )}
          </div>
          <div className="pt-4 space-y-6">
            <p className="text-center text-[#6E7286]">Follow us on</p>
            <Flex align="center" justify="center" gap="6">
              <Link href="https://facebook/">
                <IconButton>
                  <FacebookIcon />
                </IconButton>
              </Link>
              <Link href="https://instagram.com/quizmoneyng">
                <IconButton>
                  <InstagramIcon />
                </IconButton>
              </Link>
              <Link href="https://x.com/quizmoney_ng">
                <IconButton>
                  <XIcon />
                </IconButton>
              </Link>
              {/* <Link href="https://tiktok/quizmoneyng">
                <IconButton>
                  <i className="bi bi-tiktok text-primary-900 text-2xl"></i>
                </IconButton>
              </Link> */}
            </Flex>
            <p className="text-center">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="text-primary-900 font-medium underline underline-offset-2"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Flex>
      </form>
    </>
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
