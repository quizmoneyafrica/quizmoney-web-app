"use client";
import SuccessMessageModal from "@/app/components/modal/store/SuccessMessageModal";
import { EyeIcon, EyeSlash } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import { PasswordChip } from "@/app/utils/passwordChip";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const initialForm = {
  newPassword: "",
  confirmPassword: "",
  oldPassword: "",
  showOldPassword: false,
  showPassword: false,
  showConfirmPassword: false,
};
const Page = () => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const router = useRouter();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleResetFieldVisibility = (
    field: "showPassword" | "showConfirmPassword" | "showOldPassword"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const isPasswordValid =
    formData.newPassword.length >= 8 &&
    /[A-Z]/.test(formData.newPassword) &&
    /[!@#$%^&*]/.test(formData.newPassword) &&
    /[0-9]/.test(formData.newPassword);

  const isOldPasswordValid =
    formData.oldPassword.length >= 8 &&
    /[A-Z]/.test(formData.oldPassword) &&
    /[!@#$%^&*]/.test(formData.oldPassword) &&
    /[0-9]/.test(formData.oldPassword);

  const isFormValid =
    isPasswordValid &&
    isOldPasswordValid &&
    formData.newPassword === formData.confirmPassword;

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    setLoading(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <Flex direction="column" gap="40px">
        <div
          onClick={() => router.back()}
          className="flex items-center gap-2 font-semibold cursor-pointer"
        >
          <ArrowLeftIcon />
          <p>Back</p>
        </div>
        <Flex
          direction={"column"}
          gap={"20px"}
          className=" md:bg-white sm:p-5 lg:p-10 rounded-3xl"
        >
          <p className="text-xl md:text-2xl font-bold">Change Password</p>

          <form onSubmit={handleChangePassword}>
            <Flex direction="column" gap="4" className="w-full md:w-[60%]">
              <CustomTextField
                label="Old Password"
                name="oldPassword"
                value={formData.oldPassword}
                type={formData.showOldPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                onChange={handleChange}
                icon={
                  formData.showOldPassword ? (
                    <EyeIcon
                      className="text-[#A6ABC4]"
                      onClick={() =>
                        toggleResetFieldVisibility("showOldPassword")
                      }
                    />
                  ) : (
                    <EyeSlash
                      className="text-[#A6ABC4]"
                      onClick={() =>
                        toggleResetFieldVisibility("showOldPassword")
                      }
                    />
                  )
                }
                disabled={loading}
              />
              <Flex mt="2" gap="2" wrap="wrap">
                <PasswordChip
                  text="At least 8 characters"
                  valid={formData.oldPassword.length >= 8}
                />
                <PasswordChip
                  text="One uppercase letter"
                  valid={/[A-Z]/.test(formData.oldPassword)}
                />
                <PasswordChip
                  text="One special character"
                  valid={/[!@#$%^&*]/.test(formData.oldPassword)}
                />
                <PasswordChip
                  text="One digit"
                  valid={/[0-9]/.test(formData.oldPassword)}
                />
              </Flex>

              <CustomTextField
                label="Password"
                name="newPassword"
                value={formData.newPassword}
                type={formData.showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                onChange={handleChange}
                icon={
                  formData.showPassword ? (
                    <EyeIcon
                      className="text-[#A6ABC4]"
                      onClick={() => toggleResetFieldVisibility("showPassword")}
                    />
                  ) : (
                    <EyeSlash
                      className="text-[#A6ABC4]"
                      onClick={() => toggleResetFieldVisibility("showPassword")}
                    />
                  )
                }
                disabled={loading}
                required
              />
              <Flex mt="2" gap="2" wrap="wrap">
                <PasswordChip
                  text="At least 8 characters"
                  valid={formData.newPassword.length >= 8}
                />
                <PasswordChip
                  text="One uppercase letter"
                  valid={/[A-Z]/.test(formData.newPassword)}
                />
                <PasswordChip
                  text="One special character"
                  valid={/[!@#$%^&*]/.test(formData.newPassword)}
                />
                <PasswordChip
                  text="One digit"
                  valid={/[0-9]/.test(formData.newPassword)}
                />
              </Flex>
              <CustomTextField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                type={formData.showConfirmPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                onChange={handleChange}
                icon={
                  formData.showConfirmPassword ? (
                    <EyeIcon
                      className="text-[#A6ABC4]"
                      onClick={() =>
                        toggleResetFieldVisibility("showConfirmPassword")
                      }
                    />
                  ) : (
                    <EyeSlash
                      className="text-[#A6ABC4]"
                      onClick={() =>
                        toggleResetFieldVisibility("showConfirmPassword")
                      }
                    />
                  )
                }
                disabled={loading}
                required
              />
              {formData.confirmPassword.length > 1 && (
                <Flex mt="2" gap="2" wrap="wrap">
                  <PasswordChip
                    text={`${
                      formData.confirmPassword.length < 1
                        ? ""
                        : formData.confirmPassword === formData.newPassword
                        ? "Password Match"
                        : "Passwords do not match"
                    }`}
                    valid={
                      formData.confirmPassword.length > 1 &&
                      formData.newPassword === formData.confirmPassword
                    }
                  />
                </Flex>
              )}
              <div className="pt-4">
                {!loading ? (
                  <CustomButton
                    type="submit"
                    width="full"
                    disabled={!isFormValid}
                  >
                    Create Account
                  </CustomButton>
                ) : (
                  <CustomButton type="button" loader width="full" />
                )}
              </div>
            </Flex>
          </form>
        </Flex>
      </Flex>
      <SuccessMessageModal
        open={successMessage}
        setOpen={setSuccessMessage}
        success={true}
        message="Good job!"
        subMessage="You have successfully changed your password"
        onClose={() => router.push("/settings")}
        actionLabel="Go back to settings"
      />
    </motion.div>
  );
};

export default Page;
