"use client";
import { Heading } from "@radix-ui/themes";
import React from "react";
import { motion } from "framer-motion";

function Page() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.25, ease: "easeInOut" }}>
			<Heading as="h1">Wallet</Heading>
		</motion.div>
	);
}

export default Page;
