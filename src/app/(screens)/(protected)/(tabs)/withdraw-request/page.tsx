"use client";
import React from "react";
import { motion } from "framer-motion";
import WithdrawalActivity from "./cmp/WithdrawalActivity";

function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <main className="w-full ">
        <WithdrawalActivity />
      </main>
    </motion.div>
  );
}

export default Page;
