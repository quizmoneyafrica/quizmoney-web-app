import React, { useState } from "react";
import { Box, Button, Container, Flex, Text, Heading } from "@radix-ui/themes";

export default function ResetWithdrawalPinLayout() {
  const [email, setEmail] = useState("");

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "80vh", background: "#fafafa" }}
    >
      <Box className="bg-white rounded-2xl shadow-md w-full max-w-4xl p-8 md:p-12">
        <Heading as="h1" size="8" mb="2" weight="bold" color="gray">
          Reset pin
        </Heading>
        <Text as="p" size="5" color="gray" mb="8">
          Enter the email linked to your account. We'll send you a 6-digit
          verification code.
        </Text>
        <Box mb="4">
          <Box mb="2">
            <Text as="label" size="4" weight="medium" htmlFor="email">
              Enter Email Address
            </Text>
          </Box>
          <input
            id="email"
            type="email"
            style={{
              width: "100%",
              border: "1px solid #cbd5e1",
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "1.125rem",
              marginTop: "0.5rem",
              outline: "none",
            }}
            placeholder="Johndoe@samplemail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Button
          size="4"
          style={{
            width: "100%",
            borderRadius: "2rem",
            marginTop: "2rem",
            background: "#174487",
          }}
          color="blue"
        >
          Send OTP
        </Button>
      </Box>
    </Flex>
  );
}
