"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import WalletLayout from "@/app/components/wallet/WalletLayout";
import WalletApi from "@/app/api/wallet";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setWalletBalance } from "@/app/store/authSlice";

function Page() {
	const dispatch = useAppDispatch();
	useEffect(() => {
		const fetchWallet = async () => {
			const res = await WalletApi.fetchCustomerWallet();
			const balance = res.data.result.wallet;
			dispatch(setWalletBalance(balance));
			console.log("Wallet Response: ", balance);
		};
		fetchWallet();
	}, [dispatch]);
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
