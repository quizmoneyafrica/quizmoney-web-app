"use client";
import React from "react";
import { motion } from "framer-motion";
import WalletLayout from "@/app/components/wallet/WalletLayout";

function Page() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.25, ease: "easeInOut" }}>
			<WalletLayout />
		</motion.div>
	);
}

export default Page;
