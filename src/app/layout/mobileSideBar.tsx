"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Box, Flex, Grid, Separator, Text } from "@radix-ui/themes";
import { navSidebar } from "./nav";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { VerifiedBadge } from "../icons/icons";

function MobileSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleTabRoute = (path: string) => {
    console.log(path);
    if (pathname !== path) {
      router.push(path);
      window.scrollTo(0, 0);
    }
  };
  return (
    <nav className="w-full bg-black/50 fixed inset-0 z-40">
      <div className="h-screen relative z-50 w-[80%] bg-primary-900 drop-shadow-2xl">
        <section className="px-2 pt-10">
          <Grid gap="5">
            <motion.div
              className="text-white pl-4 pb-2"
              whileTap={{ scale: 0.95 }}
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
                    <VerifiedBadge />
                  </Flex>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </Grid>
              </Flex>
            </motion.div>
            <Separator size="4" color="blue" />
            <Flex direction="column" className="relative">
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
            </Flex>
          </Grid>
        </section>
      </div>
    </nav>
  );
}

export default MobileSideBar;
