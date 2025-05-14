"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import { decryptData } from "@/app/utils/crypto";
import React from "react";
import { motion } from "framer-motion";
import GameCard from "@/app/components/home/GameCard";
import TopGamers from "@/app/components/home/TopGamers";
import ReferBox from "@/app/components/home/ReferBox";
import { Grid } from "@radix-ui/themes";

function HomeTab() {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user = encrypted ? decryptData(encrypted) : null;

  console.log("USER: ", user);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Grid>
          <Grid gap="4">
            <GameCard />
            <TopGamers />
            <ReferBox refCode={user?.referralCode} />
          </Grid>
        </Grid>
      </motion.div>
    </>
  );
}

export default HomeTab;
