"use client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
const Support = () => {
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
            <p className="text-xl md:text-2xl font-bold">Support</p>

            <p className="text-xs md:text-sm">Get answers to your questions </p>
          </div>
          <p className="text-lg md:text-xl text-primary-700 font-bold">
            No Answer To Your Question? Ask Our User Support Team
          </p>

          <div className="flex gap-6 md:gap-10 mt-4 flex-col">
            {/* <div className="flex items-center gap-6 border-b border-zinc-200 pb-4">
              <div className="bg-primary-50 rounded-full h-[48px] w-[48px] p-2 flex items-center justify-center">
                <Image
                  src="/icons/ticket.svg"
                  alt="ticket"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className=" font-semibold">
                  Log your issue to the support team
                </p>
                <p
                  onClick={() => router.push("/support/ticket")}
                  className="text-sm underline text-primary-700 mt-1 cursor-pointer"
                >
                  View ticket
                </p>
              </div>
            </div> */}

            <div className="flex items-center border-b border-zinc-200 pb-4 gap-6">
              <div className="bg-primary-50 rounded-full h-[48px] w-[48px] p-2 flex items-center justify-center">
                <Image
                  src="/icons/question.svg"
                  alt="ticket"
                  width={13}
                  height={13}
                />
              </div>
              <div>
                <p className=" font-semibold">Visit Our Help Section</p>
                <Link
                  href="https://quizmoney.ng/faqs"
                  className="text-sm underline text-primary-700 mt-1"
                >
                  Faqs & Help{" "}
                </Link>
              </div>
            </div>

            <div className="flex items-center border-b border-zinc-200 pb-4 gap-6">
              <div className="bg-primary-50 rounded-full h-[48px] w-[48px] p-2 flex items-center justify-center">
                <Image
                  src="/icons/device-message.svg"
                  alt="ticket"
                  width={22}
                  height={22}
                />
              </div>
              <div>
                <p className=" font-semibold">Contact us via email at</p>
                <Link
                  href="mailto:hi@quizmoney.ng"
                  className="text-sm underline text-primary-700 mt-1"
                >
                  hi@quizmoney.ng
                </Link>
              </div>
            </div>
          </div>
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Support;
