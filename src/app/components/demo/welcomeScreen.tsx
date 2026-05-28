"use client";
import { CircleArrowLeft } from "@/app/icons/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import CustomButton from "@/app/utils/CustomBtn";
import { Grid, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { usePracticeSocket } from "@/lib/practice-store";
import { toast } from "sonner";

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { startPractice, isConnected } = usePracticeSocket();

  const handleStart = () => {
    if (!isConnected) {
      toast.error("Not connected. Please wait and try again.");
      return;
    }

    setLoading(true);
    startPractice(undefined, (res) => {
      if (res.success && res.data) {
        router.replace("/play-demo/practice");
      } else {
        toast.error(res.message || "Failed to start practice. Try again.");
        setLoading(false);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="bg-neutral-50 w-full min-h-screen">
        <div className="w-full max-w-screen-lg mx-auto px-4 pt-6 pb-4">
          <button
            onClick={() => router.replace("/home")}
            className="cursor-pointer"
          >
            <CircleArrowLeft />
          </button>

          <div className="space-y-6 w-full max-w-lg mx-auto">
            <div className="relative flex items-center justify-center">
              <Image
                src="/assets/images/demo-star.svg"
                alt="Quiz Money Demo"
                width={398}
                height={403.37}
              />
              <Image
                src="/assets/images/demo-card.svg"
                alt="Quiz Money Demo"
                width={398}
                height={403.37}
                className="absolute bottom-0"
              />
            </div>
            <Grid gap="3" mt="2">
              <Heading className="text-primary-900 lg:text-center">
                Let&apos;s play a Demo 👋
              </Heading>
              <Text className="font-medium lg:text-center">
                You&apos;re about to play a solo warm up round.
                <br /> This is just for fun. No pressure.
              </Text>
            </Grid>
            <div className="pt-10">
              {loading ? (
                <CustomButton loader width="full" disabled />
              ) : (
                <CustomButton onClick={handleStart} width="full">
                  Start Game
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
