"use client";
import React from "react";
import WalletActivity from "./WalletActivity";
import { motion } from "framer-motion";

export default function TransactionsLayout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <main className="w-full">
        <WalletActivity />
      </main>
    </motion.div>
  );
}
