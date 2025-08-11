/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import LeftSide from "../forgot-password/leftSide";
import CustomButton from "@/app/utils/CustomBtn";
import { SuccessIcon } from "@/app/utils/successIcon";
import { useRouter } from "next/navigation";
import UserAPI from "@/app/api/userApi";
import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";

function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const loginData = localStorage.getItem("login");
  const { loginUser, updateCustomer } = useAuth();

  const handleGoHome = async () => {
    setIsLoading(true);
    if (loginData) {
      const parsed = JSON.parse(loginData);
      console.log(parsed);
      try {
        const res = await UserAPI.login(parsed);
        console.log("RES", res);
        const data = await UserAPI.customerProfile(res.data.accessToken);
        console.log("Customer Profile", data);
        if (res.success) {
          loginUser(res.data);
          if (res.data.accessToken) {
            updateCustomer(data.data);
            router.replace("/home");
            localStorage.removeItem("login");
          }
        }
      } catch (error: any) {
        toast.error(error.message, { position: toastPosition });
      } finally {
        setIsLoading(false);
      }
    } else {
      router.replace("/");
    }
  };
  return (
    <Grid columns={{ initial: "1", md: "2" }} className="h-screen">
      <LeftSide />
      <Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
        <div className="space-y-10">
          <Flex
            align="center"
            direction="column"
            gap="3"
            className="text-center"
          >
            <SuccessIcon size="lg" />
            <Heading as="h2">Welcome</Heading>
            <Text className="text-neutral-600 ">
              You have successfully created your account
            </Text>
          </Flex>
          {!isLoading ? (
            <CustomButton type="button" width="full" onClick={handleGoHome}>
              Proceed to Home
            </CustomButton>
          ) : (
            <CustomButton
              type="button"
              width="full"
              disabled
              loader
            ></CustomButton>
          )}
        </div>
      </Container>
    </Grid>
  );
}

export default Page;
