"use client";

import { Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import LeftSide from "../forgot-password/leftSide";
import CustomButton from "@/app/utils/CustomBtn";
import { SuccessIcon } from "@/app/utils/successIcon";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/queries";

function Page() {
  const router = useRouter();
  const { mutate: login, isPending: isLoading } = useLogin();

  const handleGoHome = () => {
    const stored = localStorage.getItem("login");
    if (stored) {
      const { email, password } = JSON.parse(stored);
      login(
        { email, password },
        {
          onSuccess: () => {
            localStorage.removeItem("login");
            router.replace("/home");
          },
          onError: () => router.replace("/login"),
        }
      );
    } else {
      router.replace("/login");
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
