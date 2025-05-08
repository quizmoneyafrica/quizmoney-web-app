"use client";
import { Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { bottomNav, navs } from "./nav";
import { AnimatePresence, motion } from "framer-motion";
import LogoutDialog from "../components/logout/logout";

function SidebarNav() {
	const router = useRouter();
	const pathname = usePathname();
	const [activeTab, setActiveTab] = useState(pathname);

	const handleTabRoute = (path: string) => {
		console.log(path);
		if (pathname !== path) {
			setActiveTab(path);
			router.push(path);
			window.scrollTo(0, 0);
		}
	};
	return (
		<>
			<div className="relative w-full h-screen bg-primary-900">
				<div className="grid place-items-center py-4">
					<Image
						src="/icons/quizmoney-logo-white.svg"
						alt="Quiz Money"
						width={86}
						height={47.38}
						priority
					/>
				</div>
				<Flex direction="column" px="2" className="relative">
					{navs.map((nav, index) => {
						const isActive = activeTab === nav.path;
						return (
							<button
								key={index}
								onClick={() => handleTabRoute(`${nav.path}`)}
								className={`relative cursor-pointer transition text-sm py-4 ${
									isActive ? "text-white font-semibold" : "text-primary-300"
								}`}>
								<AnimatePresence>
									{isActive && (
										<motion.div
											layoutId="nav-active-indicator"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="absolute inset-0 bg-primary-500 rounded-[8px] z-0"
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 20,
											}}
										/>
									)}
								</AnimatePresence>

								<Flex
									align="center"
									gap="3"
									mx="4"
									className={`relative z-10 ${
										isActive ? "text-white font-semibold" : "text-primary-300"
									}`}>
									{nav.icon}
									<Text>{nav.name}</Text>
								</Flex>
							</button>
						);
					})}
				</Flex>
				<Flex direction="column" px="2" pb="4" gap="2" className="absolute bottom-0 w-full">
					{bottomNav.map((nav, index) => {
						const isActive = activeTab === nav.path;
						const isLogout = nav.name === "Logout";
						const buttonContent = (
							<Flex
								align="center"
								gap="3"
								mx="4"
								className={`relative z-10 ${
									isActive ? "text-white font-semibold" : "text-primary-300"
								} ${isLogout && "text-white"}`}>
								{nav.icon}
								<Text>{nav.name}</Text>
							</Flex>
						);
						return isLogout ? (
							<LogoutDialog key={index}>
								<button className="relative  hover:bg-error-900 opacity-70 rounded-[8px] cursor-pointer transition text-sm py-4">
									{buttonContent}
								</button>
							</LogoutDialog>
						) : (
							<button
								key={index}
								onClick={() => handleTabRoute(`${nav.path}`)}
								className={`relative cursor-pointer transition text-sm py-4 ${
									isActive ? "text-white font-semibold" : "text-primary-300"
								}`}>
								<AnimatePresence>
									{isActive && (
										<motion.div
											layoutId="nav-active-indicator"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="absolute inset-0 bg-primary-500 rounded-[8px] z-0"
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 20,
											}}
										/>
									)}
								</AnimatePresence>
								{buttonContent}
							</button>
						);
					})}
				</Flex>
			</div>
		</>
	);
}

export default SidebarNav;
