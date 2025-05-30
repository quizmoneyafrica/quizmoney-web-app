"use client";
import { SignUpFormType } from "@/app/api/interface";
import useFcmToken from "@/app/hooks/useFcmToken";
import { EyeIcon, EyeSlash } from "@/app/icons/icons";
import CustomTextField from "@/app/utils/CustomTextField";
import { capitalizeFirstLetter, toastPosition } from "@/app/utils/utils";
import { Container, Flex } from "@radix-ui/themes";
import * as React from "react";
import { toast } from "sonner";
import CustomButton from "@/app/utils/CustomBtn";
// import { useRouter } from "next/navigation";
import UserAPI from "@/app/api/userApi";
import { PasswordChip } from "@/app/utils/passwordChip";
import getDeviceId from "@/app/pwa/deviceId";
import { encryptData } from "@/app/utils/crypto";
import { useAuth } from "@/app/hooks/useAuth";

interface IStepThreeProps {
  formData: SignUpFormType;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleResetFieldVisibility: (
    field: "showPassword" | "showConfirmPassword"
  ) => void;
}

const StepThree: React.FunctionComponent<IStepThreeProps> = (props) => {
  const { token, notificationPermissionStatus } = useFcmToken();
  const { formData, onChange, toggleResetFieldVisibility } = props;
  // const router = useRouter();
  const { loginUser } = useAuth();

  const [loading, setLoading] = React.useState(false);

  const isPasswordValid =
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[!@#$%^&*]/.test(formData.password) &&
    /[0-9]/.test(formData.password);

  const isFormValid =
    isPasswordValid && formData.password === formData.confirmPassword;

  const handleSignUp = async (e: React.FormEvent) => {
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
    const deviceId = getDeviceId();
    const newValues = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      country: formData.country,
      gender: formData.gender,
      dob: formData.dob,
      password: formData.password,
      promotionalMails: formData.promotionalMails,
      referredBy: formData.referredBy,
      deviceToken: token || "",
      deviceId: deviceId,
    };
    sessionStorage.setItem("pass", formData.password);
    try {
      const response = await UserAPI.signUp(newValues);
      const userData = response.data.result.newUser;
      const encryptedUser = encryptData(userData);
      loginUser(encryptedUser);
      console.log("Signup with:", userData);
      toast.success(`Welcome ${capitalizeFirstLetter(userData?.firstName)}`, {
        position: "top-center",
      });
      // 🔐 Encrypt the user data
      // const encryptedUser = encryptData(userData);
      // console.log("Encrypted: ", encryptedUser);

      // ✅ Dispatch to Redux
      // loginUser(encryptedUser);

      // router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      // router.replace("/account-created");

      // toast.success(
      // 	`Welcome Back ${capitalizeFirstLetter(userData?.firstName)}`,
      // 	{
      // 		position: "top-center",
      // 	}
      // );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("ERROR SIGNUP", err);
      toast.error(`${err.response.data.error}`, {
        position: toastPosition,
      });
    } finally {
      setLoading(false);
    }
  };
  console.log("DATA: ", formData);

  return (
    <>
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
    </>
  );
};

export default StepThree;
