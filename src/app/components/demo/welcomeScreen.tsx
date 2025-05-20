"use client";
import { ApiResponse } from "@/app/api/interface";
import { CircleArrowLeft } from "@/app/icons/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import CustomButton from "@/app/utils/CustomBtn";
import { Grid, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useDispatch } from "react-redux";
import DemoApi from "@/app/api/demo";
import { setDemoData } from "@/app/store/demoSlice";

export default function WelcomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFetchDemoData = async () => {
    setLoading(true);
    dispatch(setDemoData({}));
    try {
      const res: ApiResponse = await DemoApi.fetchDemoGame();
      const demoData = res.data.result;
      dispatch(setDemoData(demoData));
      // console.log("Practice Questions: ", demoData);

      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      setLoading(false);
    }
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
          <button onClick={() => router.back()} className="cursor-pointer">
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
                Let&apos;s play a Demo 👋{" "}
              </Heading>
              <Text className="font-medium lg:text-center">
                You are about to enter Quiz Money demo playground. Let&apos;s
                Goooooo! 😃{" "}
              </Text>
            </Grid>
            <div className="pt-10">
              {loading ? (
                <CustomButton loader width="full" disabled />
              ) : (
                <CustomButton onClick={handleFetchDemoData} width="full">
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
