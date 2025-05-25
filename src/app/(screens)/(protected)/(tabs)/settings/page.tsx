"use client";
import { User } from "@/app/api/interface";
import LogoutDialog from "@/app/components/logout/logout";
import { useAppSelector } from "@/app/hooks/useAuth";
import { SupportIcon } from "@/app/icons/icons";
import { decryptData } from "@/app/utils/crypto";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Flex, Grid } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const router = useRouter();
  const [openLogout, setOpenLogout] = useState(false);
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <Flex direction="column" gap="40px">
        <Flex
          onClick={() => router.push("/settings/profile")}
          className="bg-white rounded-2xl sm:rounded-xl p-4 cursor-pointer"
        >
          <Flex gap="10px">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-zinc-200">
              <Image
                src={user?.avatar ?? "/assets/images/profile.png"}
                alt="profile"
                width={100}
                height={100}
              />
            </div>
            <Flex direction="column">
              <p className="text-lg sm:text-2xl font-semibold capitalize">
                {user?.firstName} {user?.lastName}
              </p>
              <p>Edit Profile</p>
            </Flex>
          </Flex>
        </Flex>
        {/* general */}
        <Flex direction={"column"} gap={"15px"}>
          <p className="text-lg  font-semibold">General</p>
          <Grid columns={{ initial: "1", md: "2" }} gap={"18px"}>
            <Flex
              onClick={() => router.push("/settings/how-it-works")}
              className="cursor-pointer bg-white p-4 md:p-6 rounded-2xl sm:rounded-xl border border-zinc-200"
              align={"center"}
              justify={"between"}
            >
              <Flex gap={"3"} align={"center"}>
                <Link
                  href="https://quizmoney.ng/how-it-works"
                  className="h-12 w-12 bg-primary-50 rounded-full flex justify-center items-center"
                >
                  <Image
                    src="/icons/setting.svg"
                    alt="terms"
                    width={24}
                    height={24}
                  />{" "}
                </Link>
                <p className=" text-lg font-semibold ">How it Works</p>
              </Flex>
              <ChevronRightIcon height={25} width={25} />
            </Flex>
            <Flex
              className="cursor-pointer bg-white p-4 md:p-6 rounded-2xl sm:rounded-xl border border-zinc-200"
              align={"center"}
              justify={"between"}
              onClick={() => router.push("/support")}
            >
              <Flex gap={"3"} align={"center"}>
                <div className="h-12 w-12 bg-primary-50 rounded-full flex justify-center items-center">
                  <SupportIcon className="text-primary-500" />
                </div>
                <p className=" text-lg font-semibold ">Support</p>
              </Flex>
              <ChevronRightIcon height={25} width={25} />
            </Flex>
            <Flex
              onClick={() => router.push("/settings/change-password")}
              className="cursor-pointer bg-white p-4 md:p-6 rounded-2xl sm:rounded-xl border border-zinc-200"
              align={"center"}
              justify={"between"}
            >
              <Flex gap={"3"} align={"center"}>
                <div className="h-12 w-12 bg-primary-50 rounded-full flex justify-center items-center">
                  <Image
                    src="/icons/security-safe.svg"
                    alt="terms"
                    width={24}
                    height={24}
                  />{" "}
                </div>
                <p className=" text-lg font-semibold ">Change Password</p>
              </Flex>
              <ChevronRightIcon height={25} width={25} />
            </Flex>
            <Flex
              onClick={() => router.push("/settings/invite-&-earn")}
              className="cursor-pointer bg-white p-4 md:p-6 rounded-2xl sm:rounded-xl border border-zinc-200"
              align={"center"}
              justify={"between"}
            >
              <Flex gap={"3"} align={"center"}>
                <div className="h-12 w-12 bg-primary-50 rounded-full flex justify-center items-center">
                  <Image
                    src="/icons/user-cirlce-add.svg"
                    alt="terms"
                    width={24}
                    height={24}
                  />{" "}
                </div>
                <p className=" text-lg font-semibold ">Invite & Earn</p>
              </Flex>
              <ChevronRightIcon height={25} width={25} />
            </Flex>
          </Grid>
        </Flex>

        {/* legal */}
        <Flex direction={"column"} gap={"15px"}>
          <p className="text-lg  font-semibold">Legal</p>
          <Grid columns={{ initial: "1", md: "2" }} gap={"18px"}>
            <Link
              href="https://quizmoney.ng/terms-and-conditions"
              target="_blank"
            >
              <Flex
                className="cursor-pointer bg-white p-4 md:p-6 rounded-2xl sm:rounded-xl border border-zinc-200"
                align={"center"}
                justify={"between"}
                // onClick={() => router.push("/settings/terms-and-conditions")}
              >
                <Flex gap={"3"} align={"center"}>
                  <div className="h-12 w-12 bg-primary-50 rounded-full flex justify-center items-center">
                    <Image
                      src="/icons/document-text.svg"
                      alt="terms"
                      width={24}
                      height={24}
                    />
                  </div>
                  <p className=" text-lg font-semibold ">Terms & Condition</p>
                </Flex>
                <ChevronRightIcon height={25} width={25} />
              </Flex>
            </Link>

            <Flex
              onClick={() => setOpenLogout(true)}
              className="cursor-pointer bg-white p-4 md:p-6 rounded-2xl sm:rounded-xl border border-zinc-200"
              align={"center"}
              justify={"between"}
            >
              <Flex gap={"3"} align={"center"}>
                <div className="h-12 w-12 bg-rose-50 rounded-full flex justify-center items-center">
                  <Image
                    src="/icons/logout.svg"
                    alt="terms"
                    width={24}
                    height={24}
                  />
                </div>
                <p className=" text-lg font-semibold ">Logout</p>
              </Flex>
              <ChevronRightIcon height={25} width={25} />
            </Flex>
          </Grid>
        </Flex>
      </Flex>
      <LogoutDialog open={openLogout} onOpenChange={setOpenLogout} />
    </motion.div>
  );
}

export default Page;
