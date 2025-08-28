"use client";
import React from "react";
import { motion } from "framer-motion";
import { Avatar, Flex, Grid, Separator, Text } from "@radix-ui/themes";
import { navSidebar } from "./nav";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { VerifiedBadge } from "../icons/icons";
import { MenuToggle } from "./MenuToggle";
import { useKycStep } from "../hooks/useKycStep";

const sidebarOptions = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(20px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
const transition = {
  duration: 0.8,
  delay: 0.5,
  ease: [0, 0.71, 0.2, 1.01],
};

interface Prop {
  isOpen: boolean;
  toggle: () => void;
}
const MobileSideBar = ({ isOpen, toggle }: Prop) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { customerKyc } = useKycStep();
  const bvnStep = customerKyc.find((s) => s.step === "BVN");

  const handleTabRoute = (path: string) => {
    console.log(path);
    if (pathname !== path) {
      router.push(path);
      window.scrollTo(0, 0);
      toggle();
    }
  };
  return (
    <motion.nav
      variants={sidebarOptions}
      className="w-full bg-black/50 fixed inset-0 z-40"
    >
      <motion.div className="h-screen relative z-50 w-[80%] bg-primary-900 drop-shadow-2xl">
        <MenuToggle toggle={toggle} />
        <motion.section
          animate={{ y: isOpen ? 0 : 1500 }}
          transition={transition}
          className="px-2 pt-16"
        >
          <Grid gap="5">
            <motion.div
              className="text-white pl-4 pb-2 cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                router.push("/settings/profile");
                toggle();
              }}
            >
              <Flex gap="2">
                <Avatar
                  src={user?.avatarUrl}
                  fallback={user?.firstName?.charAt(0).toUpperCase() || ""}
                  radius="full"
                  className="bg-primary-50 border-3"
                  size="4"
                />

                <Grid>
                  <Flex align="center" gap="2">
                    <h2>
                      {user?.firstName} {user?.lastName}
                    </h2>
                    {bvnStep && bvnStep?.status === "COMPLETED" && (
                      <VerifiedBadge />
                    )}
                  </Flex>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </Grid>
              </Flex>
            </motion.div>
            <Separator size="4" color="blue" />
            <motion.div variants={variants} className="relative grid">
              {navSidebar.map((nav, index) => {
                // const isActive = splitName.includes(nav.name.toLowerCase());
                const isActive =
                  pathname === nav.path || pathname.startsWith(nav.path + "/");
                return (
                  <motion.button
                    layout
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTabRoute(`${nav.path}`)}
                    // className={`relative cursor-pointer transition text-sm py-4 ${
                    //   isActive ? "text-white font-semibold" : "text-primary-300"
                    // }`}
                    className={`relative cursor-pointer transition text-sm py-4 ${
                      isActive
                        ? "text-white font-semibold bg-primary-500 rounded-[8px]"
                        : "text-primary-300"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute inset-0 bg-primary-500 rounded-[8px] z-0"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

                    <Flex
                      align="center"
                      gap="3"
                      mx="4"
                      className={`relative z-10 ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-primary-300"
                      }`}
                    >
                      {nav.icon}
                      <Text>{nav.name}</Text>
                    </Flex>
                  </motion.button>
                );
              })}
            </motion.div>
          </Grid>
        </motion.section>
      </motion.div>
    </motion.nav>
  );
};

export default MobileSideBar;
