"use client";
import React, { useState } from "react";
import { Flex, Grid, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { navs } from "./nav";

function BottomNavigation() {
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
		<div className="lg:hidden fixed z-50 bottom-0 pb-6 left-0 w-full bg-primary-900 py-4 flex items-center">
			<div className="w-full">
				<Grid columns="5" align="center" justify="between">
					{navs.map((nav, index) => {
						const isActive = activeTab === nav.path;
						return (
							<div key={index}>
								<Flex
									direction="column"
									gap="1"
									align="center"
									className={`cursor-pointer transition text-xs ${
										isActive ? "text-white font-semibold" : "text-primary-300"
									}`}
									onClick={() => handleTabRoute(`${nav.path}`)}>
									{nav.icon}
									<Text>{nav.name}</Text>

									{isActive && (
										<motion.div
											layoutId="nav-active-indicator"
											className="absolute top-0 w-20 h-full bg-primary-500/20 blur-sm "
											transition={{
												type: "spring",
												stiffness: 100,
												damping: 10,
											}}
										/>
									)}
								</Flex>
							</div>
						);
					})}
				</Grid>
			</div>
		</div>
	);
}

export default BottomNavigation;
