"use client";
import { Flex } from "@radix-ui/themes";
import React, { useState } from "react";
import { motion } from "framer-motion";
import StepOne from "./formSteps/step1";
import StepTwo from "./formSteps/step2";
import StepThree from "./formSteps/step3";
import SocialFollow from "@/app/components/follow/socialFollow";
import Link from "next/link";
import NLRC from "@/app/components/follow/nlrc";

type Props = {
  step: number;
  nextStep: () => void;
};

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
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

  const phoneOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Remove any non-digit characters except for +
    input = input.replace(/[^\d+]/g, "");

    // Normalize to +234 format
    if (input.startsWith("0")) {
      input = "+234" + input.slice(1);
    } else if (!input.startsWith("+234")) {
      input = "+234" + input.replace(/^(\+)?(234)?/, "");
    }

    // Block typing if already 14 characters
    if (input.length > 14) return;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: input,
    }));
  };

  const toggleResetFieldVisibility = (
    field: "showPassword" | "showConfirmPassword"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  return (
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
                phoneOnChange={phoneOnChange}
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
      <div className="py-4 space-y-6">
        <p className="text-center pb-3">
          Already have an Account?{" "}
          <Link
            href="/login"
            className="text-primary-900 font-medium underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
        <SocialFollow />
        <NLRC />
      </div>
    </Flex>
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
      className={`h-[8px] w-full rounded-full`}
    />
  );
};
