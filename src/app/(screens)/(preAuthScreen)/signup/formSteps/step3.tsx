"use client";
import { SignUpFormType } from "@/app/api/interface";
import { EyeIcon, EyeSlash } from "@/app/icons/icons";
import CustomTextField from "@/app/utils/CustomTextField";
import { toastPosition } from "@/app/utils/utils";
import { Container, Flex } from "@radix-ui/themes";
import * as React from "react";
import { toast } from "sonner";
import CustomButton from "@/app/utils/CustomBtn";
import { useRegister } from "@/lib/queries";
import { PasswordChip } from "@/app/utils/passwordChip";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IStepThreeProps {
  formData: SignUpFormType;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleResetFieldVisibility: (
    field: "showPassword" | "showConfirmPassword"
  ) => void;
}

const StepThree: React.FunctionComponent<IStepThreeProps> = (props) => {
  const router = useRouter();
  const { formData, onChange, toggleResetFieldVisibility } = props;
  const { mutate: register, isPending: loading } = useRegister();

  const isPasswordValid =
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[!@#$%^&*]/.test(formData.password) &&
    /[0-9]/.test(formData.password);

  const isFormValid =
    isPasswordValid && formData.password === formData.confirmPassword;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    register(
      {
        username: formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone || undefined,
        referral_code: formData.referredBy || undefined,
      },
      {
        onSuccess: () => {
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } }; message?: string };
          toast.error(err?.response?.data?.message ?? err?.message ?? "Registration failed", {
            position: toastPosition,
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSignUp}>
      <Flex direction="column" gap="4">
        <Container>
          <CustomTextField
            label="Password"
            name="password"
            value={formData.password}
            type={formData.showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            onChange={onChange}
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
              valid={formData.password.length >= 8}
            />
            <PasswordChip
              text="One uppercase letter"
              valid={/[A-Z]/.test(formData.password)}
            />
            <PasswordChip
              text="One special character"
              valid={/[!@#$%^&*]/.test(formData.password)}
            />
            <PasswordChip
              text="One digit"
              valid={/[0-9]/.test(formData.password)}
            />
          </Flex>
        </Container>
        <Container>
          <CustomTextField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            type={formData.showConfirmPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            onChange={onChange}
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
                    : formData.confirmPassword === formData.password
                    ? "Password Match"
                    : "Passwords do not match"
                }`}
                valid={
                  formData.confirmPassword.length > 1 &&
                  formData.password === formData.confirmPassword
                }
              />
            </Flex>
          )}
        </Container>
        <div className="text-sm grid grid-cols-[1.6rem_1fr] items-center py-2">
          <input
            type="checkbox"
            name="agree"
            id="agree"
            className="h-5 w-5"
            required
          />
          <label htmlFor="agree" className="text-neutral-700">
            By clicking <span>&quot;Create Account&quot;</span>, you confirm
            that you have read and agreed to our
            <Link
              href="https://www.quizmoney.ng/terms-of-use"
              className="text-primary-900 ml-1"
            >
              terms & conditions
            </Link>{" "}
            <span className="mx-0.5">and</span>{" "}
            <Link
              href="https://www.quizmoney.ng/privacy-policy"
              className="text-primary-900"
            >
              privacy policy
            </Link>
          </label>
        </div>
        <div className="pt-4">
          {!loading ? (
            <CustomButton type="submit" width="full" disabled={!isFormValid}>
              Create Account
            </CustomButton>
          ) : (
            <CustomButton type="button" loader width="full" />
          )}
        </div>
      </Flex>
    </form>
  );
};

export default StepThree;
