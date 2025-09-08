/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { EraserIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Avatar, Container, Flex, Heading } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownFillIcon,
  BellIcon,
  CircleArrowLeft,
  LogoutIcon,
  PersonIcon,
  QMCoin,
  SupportIcon,
  VerifiedBadge,
} from "../icons/icons";
import { useAppSelector, useAuth } from "../hooks/useAuth";
import { DropdownMenu } from "radix-ui";
import LogoutDialog from "../components/logout/logout";
import { useDispatch } from "react-redux";
import NotificationApi from "../api/notification";
import { setNotificationsCount } from "../store/notificationSlice";
import { motion, useCycle } from "framer-motion";
import MobileSideBar from "./mobileSideBar";
import { useKycStep } from "../hooks/useKycStep";
import { useWalletBalances } from "../hooks/useWallet";

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
  }, [ref]);

  return dimensions.current;
};

function AppHeader() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const excludedPaths = ["/practice-game"];
  const router = useRouter();
  const [openLogout, setOpenLogout] = useState(false);
  const { notificationCount } = useAppSelector((state) => state.notifications);
  const { user } = useAuth();
  const { customerKyc } = useKycStep();
  const bvnStep = customerKyc.find((s) => s.step === "BVN");
  const { qmcBalance } = useWalletBalances();

  //Mobile Menu
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  //Mobile Menu

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await NotificationApi.fetchNotificationsCount();
      console.log("Notify", res);

      dispatch(setNotificationsCount(res.data.count));
    } catch (err: any) {
      console.log(err.message);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (excludedPaths.includes(pathname)) return null;

  const lastSegment =
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "";
  const isPin = () => pathname.includes("wallet") && pathname.includes("pin");
  const isVerifyOtp = () =>
    pathname.includes("wallet") && pathname.includes("verify-otp");
  return (
    <div className="pb-4 relative">
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        className={`lg:hidden relative bg-green-100 -top-4 -left-5 ${
          !isOpen && "-ml-1 w-screen"
        }`}
      >
        <MobileSideBar isOpen={isOpen} toggle={() => toggleOpen()} />
      </motion.nav>
      <Flex align="center" justify="between" gap="2">
        <Heading
          size={{ initial: "4", lg: "5" }}
          className="capitalize flex items-center flex-wrap overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-none"
        >
          <div className="relative flex-row flex items-center gap-2">
            {pathname.split("/").length > 2 ||
              pathname.includes("notification") ||
              (pathname.includes("kyc") && (
                <button
                  onClick={() => router?.back()}
                  className=" cursor-pointer "
                >
                  <CircleArrowLeft />
                </button>
              ))}

            <div className="hidden lg:block">
              {lastSegment === "Home" ? (
                <span className="flex items-center gap-1 capitalize font-bold">
                  Welcome, {user?.firstName || ""}
                  {bvnStep && bvnStep?.status === "COMPLETED" ? (
                    <VerifiedBadge className="text-primary-900" />
                  ) : (
                    "👋"
                  )}
                </span>
              ) : isVerifyOtp() || isPin() ? (
                <span className="flex capitalize font-bold ">Reset Pin</span>
              ) : (
                <span className="flex capitalize font-bold ">
                  {lastSegment}
                </span>
              )}
            </div>
          </div>

          {/* <span className="lg:hidden">{lastSegment}</span> */}
        </Heading>

        <Flex align="center" gap={{ initial: "1", lg: "6" }}>
          <Link href="/wallet?tab=coin">
            <Flex
              align="center"
              gap="1"
              className="rounded-full text-xs border-2 py-1 px-2 border-neutral-400 text-neutral-500 hover:border-primary-500 hover:text-primary-900 cursor-pointer"
            >
              <QMCoin width={15} height={15} />
              <span>{qmcBalance | 0}</span>
            </Flex>
          </Link>
          <Link href="/store">
            <Flex
              align="center"
              gap="1"
              className="rounded-full text-xs border-2 py-1 px-2 border-neutral-400 text-neutral-500 hover:border-primary-500 hover:text-primary-900 cursor-pointer"
            >
              <EraserIcon />
              <span>{user?.gameEraserCount}</span>
            </Flex>
          </Link>
          <Link
            href="/notification"
            className="text-neutral-600 hover:text-primary-900 relative"
          >
            <BellIcon />
            {notificationCount > 0 && (
              <div className="flex items-center justify-center h-4.5 w-4.5 rounded-full bg-primary-900 absolute -top-1 -right-1 text-white text-[0.5rem]">
                {notificationCount > 99 ? "99+" : notificationCount}
              </div>
            )}
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Container className="bg-white border border-primary-50 lg:border-none rounded-full p-1 lg:px-2 lg:py-1 cursor-pointer">
                <Flex align="center" gap="2">
                  <Avatar
                    src={user?.avatarUrl}
                    fallback={user?.firstName?.charAt(0).toUpperCase() || ""}
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

                <DropdownMenu.Item
                  className="DropdownMenuItem"
                  onClick={() => router.push("/support")}
                >
                  Support{" "}
                  <span className="RightSlot">
                    <SupportIcon />
                  </span>
                </DropdownMenu.Item>

                <Link href="https://quizmoney.ng/how-it-works" target="_blank">
                  <DropdownMenu.Item className="DropdownMenuItem">
                    How It Works{" "}
                    <span className="RightSlot">
                      <QuestionMarkCircledIcon />
                    </span>
                  </DropdownMenu.Item>
                </Link>
                <DropdownMenu.Item
                  onSelect={() => {
                    setOpenLogout(true);
                  }}
                  className="DropdownMenuItem hover:!bg-error-900"
                >
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
      <div className="lg:hidden">
        {lastSegment === "Home" ? (
          <span className="flex items-center gap-1 capitalize font-bold">
            Welcome, {user?.firstName || ""}
            {bvnStep && bvnStep?.status === "COMPLETED" ? (
              <VerifiedBadge className="text-primary-900" />
            ) : (
              "👋"
            )}
          </span>
        ) : isVerifyOtp() || isPin() ? (
          <span className="flex capitalize font-bold ">Reset Pin</span>
        ) : (
          <span className="flex capitalize font-bold ">{lastSegment}</span>
        )}
      </div>
      {/* {lastSegment === "Home" && (
        <Text className="text-sm lg:text-base">
          Let&apos;s see what you&apos;ve got
        </Text>
      )} */}

      <LogoutDialog open={openLogout} onOpenChange={setOpenLogout} />
    </div>
  );
}

export default AppHeader;
