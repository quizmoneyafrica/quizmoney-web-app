"use client";
import { Flex } from "@radix-ui/themes";
import React, { useState } from "react";
import { IconButton } from "../login/loginForm";
import { FacebookIcon, InstagramIcon, XIcon } from "@/app/icons/icons";
import Link from "next/link";
import { motion } from "framer-motion";
import StepOne from "./formSteps/step1";
import StepTwo from "./formSteps/step2";
import StepThree from "./formSteps/step3";

type Props = {
  step: number;
  nextStep: () => void;
};

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  dob: "",
  gender: "",
  country: "nigeria",
  password: "",
  confirmPassword: "",
  referralCode: "",
  showPassword: false,
  showConfirmPassword: false,
  promotionalMails: false,
  referredBy: "",
};
const SignupForm = ({ step, nextStep }: Props) => {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleResetFieldVisibility = (
    field: "showPassword" | "showConfirmPassword"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  //   const handleInstagram = () => {
  //     // toast.info("Google Sign up Coming soon", {
  //     //   position: toastPosition,
  //     //   icon: <GoogleIcon />,
  //     // });
  //   };
  //   const handleFacebook = () => {
  //     toast.info("Facebook Sign up Coming soon", {
  //       position: toastPosition,
  //       icon: <FacebookIcon />,
  //     });
  //   };
  //   const handleTwitter = () => {
  //     toast.info("Apple Sign up Coming soon", {
  //       position: toastPosition,
  //       icon: <AppleIcon />,
  //     });
  //   };
  //   const handleTikTok = () => {
  //     toast.info("Apple Sign up Coming soon", {
  //       position: toastPosition,
  //       icon: <AppleIcon />,
  //     });
  //   };

  return (
    <>
      <Flex direction="column" gap="4">
        <div className="pt-4 w-full">
          <Flex direction="column" gap="4">
            <Flex gapX="4">
              <StepIndicator complete={step >= 1} />
              <StepIndicator complete={step >= 2} />
              <StepIndicator complete={step === 3} />
            </Flex>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <StepOne
                  nextStep={nextStep}
                  formData={formData}
                  onChange={handleChange}
                />
              )}
              {step === 2 && (
                <StepTwo
                  nextStep={nextStep}
                  formData={formData}
                  onChange={handleChange}
                />
              )}
              {step === 3 && (
                <StepThree
                  formData={formData}
                  toggleResetFieldVisibility={toggleResetFieldVisibility}
                  onChange={handleChange}
                />
              )}
            </motion.div>
          </Flex>
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
            Already have an Account?{" "}
            <Link
              href="/login"
              className="text-primary-900 font-medium underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Flex>
    </>
  );
};
export default SignupForm;

interface IStepIndicatorProps {
  complete: boolean;
}

const StepIndicator: React.FunctionComponent<IStepIndicatorProps> = ({
  complete,
}) => {
  return (
    <>
      <motion.div
        initial={false}
        animate={{
          backgroundColor: complete
            ? "var(--color-primary-700)"
            : "var(--color-primary-50)",
          scale: complete ? 1.05 : 1,
          opacity: complete ? 1 : 0.5,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        // className={`${
        // 	complete ? "bg-primary-700" : "bg-primary-50"
        // } h-[8px] w-full rounded-full`}
        className={`h-[8px] w-full rounded-full`}
      />
    </>
  );
};
