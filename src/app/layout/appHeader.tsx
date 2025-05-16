"use client";
import { EraserIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Avatar, Container, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  ArrowDownFillIcon,
  BellIcon,
  LogoutIcon,
  PersonIcon,
  PlusIcon,
  SupportIcon,
} from "../icons/icons";
import { useAppSelector } from "../hooks/useAuth";
import { decryptData } from "../utils/crypto";
import { DropdownMenu } from "radix-ui";
import LogoutDialog from "../components/logout/logout";
import CustomImage from "../components/wallet/CustomImage";

function AppHeader() {
  const pathname = usePathname();
  const excludedPaths = ["/practice-game"];
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const router = useRouter();
  const [openLogout, setOpenLogout] = useState(false);

  if (excludedPaths.includes(pathname)) return null;

  const lastSegment =
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "";

  const user = encrypted ? decryptData(encrypted) : null;
  console.log(user);

  return (
    <div className="pb-4">
      <Flex align="center" justify="between" gap="2">
        <Heading
          size={{ initial: "4", lg: "5" }}
          className="capitalize flex items-center flex-wrap overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-none"
        >
          <div className=" flex-row flex items-center gap-2">
            {pathname.split("/").length > 2 && (
              <button
                onClick={() => router?.back()}
                className=" cursor-pointer "
              >
                <CustomImage
                  alt="back icon"
                  src={"/icons/back-transaction.svg"}
                />
              </button>
            )}
            <span className=" lg:flex">
              {lastSegment === "Home"
                ? `Hello ${user?.firstName} 👋`
                : lastSegment}
            </span>
          </div>

          {/* <span className="lg:hidden">{lastSegment}</span> */}
        </Heading>
        <Flex align="center" gap={{ initial: "3", lg: "6" }}>
          <Link href="/store">
            <Flex
              align="center"
              gap="2"
              className="rounded-full border-2 px-1 border-neutral-400 text-neutral-500 hover:border-primary-500 hover:text-primary-900 cursor-pointer"
            >
              <EraserIcon />
              <span>{user?.erasers}</span>
              <PlusIcon />
            </Flex>
          </Link>
          <Link
            href="/notification"
            className="text-neutral-600 hover:text-primary-900"
          >
            <BellIcon />
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Container className="bg-white border border-primary-50 lg:border-none rounded-full p-1 lg:px-2 lg:py-1 cursor-pointer">
                <Flex align="center" gap="2">
                  <Avatar
                    src={user?.avatar}
                    fallback={user?.firstName?.charAt(0).toUpperCase()}
                    radius="full"
                    className="bg-primary-50"
                  />
                  <p className="hidden lg:flex text-[#1B212D] capitalize font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <ArrowDownFillIcon className="text-neutral-500 hidden lg:flex" />
                </Flex>
              </Container>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="DropdownMenuContent"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="DropdownMenuItem"
                  onClick={() => router.push("/settings/profile")}
                >
                  My Profile{" "}
                  <span className="RightSlot">
                    <PersonIcon />
                  </span>
                </DropdownMenu.Item>

                <DropdownMenu.Item className="DropdownMenuItem">
                  Support{" "}
                  <span className="RightSlot">
                    <SupportIcon />
                  </span>
                </DropdownMenu.Item>

								<Link href="https://quizmoney.ng/how-it-works">
									<DropdownMenu.Item className="DropdownMenuItem">
										How It Works{" "}
										<span className="RightSlot">
											<QuestionMarkCircledIcon />
										</span>
									</DropdownMenu.Item>
								</Link>
								<DropdownMenu.Item
									onSelect={(e) => {
										e.preventDefault();
										setOpenLogout(true);
									}}
									className="DropdownMenuItem hover:!bg-error-900">
									Logout{" "}
									<span className="RightSlot">
										<LogoutIcon />
									</span>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</Flex>
			</Flex>
			{lastSegment === "Home" && (
				<>
					{/* <Heading size={{ initial: "4", lg: "5" }} className="lg:hidden">
						Hello <span className="capitalize">{user?.firstName}</span> 👋
					</Heading> */}
					<Text className="text-sm lg:text-base">Let&apos;s play and earn</Text>
				</>
			)}
			<LogoutDialog open={openLogout} onOpenChange={setOpenLogout} />
		</div>
	);
}

export default AppHeader;
