"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import AppLayout from "@/app/layout/appLayout";
import { decryptData } from "@/app/utils/crypto";
import { capitalizeFirstLetter } from "@/app/utils/utils";
import React from "react";
import { motion } from "framer-motion";

function HomeTab() {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user = encrypted ? decryptData(encrypted) : null;

  //   console.log("USER: ", user);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <AppLayout>{capitalizeFirstLetter(user?.firstName)}</AppLayout>
      </motion.div>
    </>
  );
}

export default HomeTab;
