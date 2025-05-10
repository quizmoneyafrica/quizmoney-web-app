"use client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const terms = [
  {
    id: 1,
    title: "Eligibility",
    items: [
      "Quiz- Money is open to individuals who are at least 18 years old or the age of majority in their jurisdiction.",
      "Employees, affiliates, agents, and family members of  QM Technologies are not eligible to participate.",
    ],
  },
  {
    id: 2,
    title: "Gameplay",
    items: [
      "Quiz-Money is a game of skill where participants answer trivia questions to earn points.",
      "Questions may cover a variety of topics including but not limited to history, science, entertainment, and sports.",
      "Participants must provide accurate and truthful answers to the best of their knowledge.",
      "The participant with the highest score at the end of each game will be declared the winner.",
    ],
  },
  {
    id: 3,
    title: "Participation",
    items: [
      "Participants must register an account to play Quiz Money.",
      " Prizes may vary and will be announced prior to the start of each game.",
      "Participants must not use any automated methods to play the game.",
      "Any attempt to cheat, manipulate, or exploit the game will result in disqualification and possible legal action.",
    ],
  },
  {
    id: 4,
    title: "Prizes",
    items: [
      "Prizes may be awarded to winners of Quiz-Money games.",
      "Prizes may vary and will be announced prior to the start of each game.",
      "Winners will be notified via email or within the Quiz-Money app.",
      "Prizes are non-transferable to any other persons ",
    ],
  },
  {
    id: 5,
    title: "Intellectual Property",
    items: [
      "All content provided in Quiz-Money, including but not limited to questions, answers, and graphics, is the property of QM Technologies.",
      "Participants may not use, reproduce, or distribute any content from Quiz-Money without prior written permission.",
    ],
  },
  {
    id: 6,
    title: "Limitation of Liability",
    items: [
      "        QM Technologies is not responsible for any technical issues, interruptions, or errors that may occur during gameplay.",
      " Qm Technologies is not liable for any damages or losses resulting from participation in Trivia Quest.",
      "QM Technologies reserves the right to cancel, suspend, or modify the game at any time without prior notice.",
    ],
  },
];

const Page = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="pb-20"
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
          <div>
            <p className="text-xl md:text-2xl font-bold">Terms & Conditions</p>

            <p className="text-xs md:text-sm">
              Read and accept our terms of use
            </p>
          </div>

          <div className="w-full h-[281px] relative md:h-[266px] bg-primary-500 overflow-hidden rounded-[30px]">
            <Image
              src="/assets/images/background-desktop.png"
              alt="background"
              width={500}
              height={500}
              className="w-full h-full object-cover brightness-75 scale-125"
            />
            <div className="absolute top-0  w-full h-full flex flex-col justify-center items-center">
              <Image
                src="/assets/images/mobile.png"
                alt="background"
                width={400}
                height={400}
                className=""
              />
            </div>
          </div>
          <p className=" text-base md:text-lg font-bold">
            Quiz- Money Terms of Service{" "}
            <span className=" text-primary-600">
              -Last Update February 2024
            </span>
          </p>

          <div className=" text-xs md:text-sm text-zinc-500">
            <p>
              Please read these Terms and Conditions (&quot;Terms&quot;,
              &quot;Terms and Conditions&quot;) carefully before participating
              in Quiz- Money (the &quot;Game&quot;, &quot;Service&quot;)
              operated by [QM Technologies] (&quot;us&quot;, &quot;we&quot;, or
              &quot;our&quot;).
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, then you may
              not access the Service.
            </p>
          </div>

          <Flex direction={"column"} gap={"5"}>
            {terms.map((term) => (
              <Flex key={term.id} direction={"column"} gap={"2"}>
                <p className="text-base md:text-lg font-bold">
                  {term.id}. {term.title}:
                </p>
                <ul className="list-disc list-inside pl-2 md:pl-5">
                  {term.items.map((item) => (
                    <li key={item} className="text-xs md:text-sm text-zinc-500">
                      {item}
                    </li>
                  ))}
                </ul>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Page;
