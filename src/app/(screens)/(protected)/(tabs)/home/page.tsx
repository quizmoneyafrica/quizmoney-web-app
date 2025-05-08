"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import AppLayout from "@/app/layout/appLayout";
import { decryptData } from "@/app/utils/crypto";
import CustomButton from "@/app/utils/CustomBtn";
import { performLogout } from "@/app/utils/logout";
import { capitalizeFirstLetter } from "@/app/utils/utils";
import { ExitIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

function HomeTab() {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user = encrypted ? decryptData(encrypted) : null;
  const dispatch = useAppDispatch();
  const router = useRouter();

  // console.log("USER: ", user);

  const handleLogout = () => {
    performLogout(dispatch);
    router.replace("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <AppLayout>
        {capitalizeFirstLetter(user?.firstName)}
        <CustomButton onClick={handleLogout}>
          <Flex align="center" gap="2">
            <ExitIcon /> Logout
          </Flex>
        </CustomButton>
      </AppLayout>
    </motion.div>
  );
}

export default HomeTab;
