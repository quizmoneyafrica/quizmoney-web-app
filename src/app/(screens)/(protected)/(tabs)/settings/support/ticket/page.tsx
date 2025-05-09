"use client";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const tikets = [
  {
    id: "ID1234567",
    name: "Joemicky",
    status: "closed",
    message:
      "Hi, i tried withdrawing from my account my withdrawal request keeps get rejected why help ",
    createdAt: new Date(),
  },
  {
    id: "ID1234567",
    name: "Joemicky",
    status: "pending",
    message:
      "Hi, i tried withdrawing from my account my withdrawal request keeps get rejected why help ",
    createdAt: new Date(),
  },
  {
    id: "ID1234567",
    name: "Joemicky",
    status: "open",
    message:
      "Hi, i tried withdrawing from my account my withdrawal request keeps get rejected why help ",
    createdAt: new Date(),
  },
];

const Ticket = () => {
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
          <div className="">
            <p className="text-xl md:text-2xl font-bold">Support</p>

            <p className="text-xs md:text-sm mt-2">
              Get answers to your questions{" "}
            </p>
          </div>

          {/* search filter */}
          <Flex gap="20px" align="center">
            <CustomTextField label="" placeholder="Search" />

            <CustomButton className="rounded-md bg-transparent text-primary-500 border border-zinc-300 py-2">
              <Image
                src="/icons/filter.svg"
                alt="terms"
                width={24}
                height={24}
              />{" "}
            </CustomButton>
          </Flex>

          {tikets.map((ticket) => (
            <div
              onClick={() =>
                router.push(`/settings/support/ticket/${ticket.id}`)
              }
              key={ticket.id}
              className={`flex flex-col gap-4 border-l-6 bg-zinc-50 p-4 rounded-lg cursor-pointer ${
                ticket.status === "open"
                  ? "border-green-500"
                  : ticket.status === "pending"
                  ? "border-yellow-400"
                  : "border-red-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">#{ticket.id}</p>
                <p className="text-xs text-zinc-500">
                  {ticket.createdAt.toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                  <Image
                    src="/assets/images/profile.png"
                    alt="user"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="text-sm font-semibold">{ticket.name}</p>
                <p
                  className={`text-xs px-2  rounded-md ${
                    ticket.status === "open"
                      ? "text-green-600 bg-green-100"
                      : ticket.status === "pending"
                      ? "text-yellow-600 bg-yellow-100"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {ticket.status}
                </p>
              </div>
              <p className="text-sm">{ticket.message}</p>
            </div>
          ))}
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Ticket;
