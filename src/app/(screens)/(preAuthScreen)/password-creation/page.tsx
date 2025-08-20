"use client";
import { Container, Grid } from "@radix-ui/themes";
import React, { useState } from "react";
import LeftSide from "./leftSide";
import StepOne from "./steps/Step1";
import StepTwo from "./steps/Step2";

function Page() {
  const [authSteps, setAuthSteps] = useState<number>(0);
  const [otpCode, setOtpCode] = useState("");
  return (
    <Grid columns={{ initial: "1", md: "2" }} className="h-screen">
      <LeftSide />
      <Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
        {authSteps === 0 && (
          <StepOne
            setAuthSteps={setAuthSteps}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
          />
        )}
        {authSteps === 1 && <StepTwo otpCode={otpCode} />}
      </Container>
    </Grid>
  );
}

export default Page;
