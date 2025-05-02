import React from "react";
import {
	CupIcon,
	HomeIcon,
	SettingIcon,
	StoreIcon,
	WalletIcon,
} from "../icons/icons";
import { Flex, Grid } from "@radix-ui/themes";

function BottomNavigation() {
	const navs = [
		{
			icon: <HomeIcon />,
			path: "/home",
			name: "Home",
		},
		{
			icon: <WalletIcon />,
			path: "/wallet",
			name: "Wallet",
		},
		{
			icon: <StoreIcon />,
			path: "/store",
			name: "Store",
		},
		{
			icon: <CupIcon />,
			path: "/leaderboard",
			name: "Chart",
		},
		{
			icon: <SettingIcon />,
			path: "/settings",
			name: "Settings",
		},
	];

	const handleTabRoute = (path: string) => {
		console.log(path);
	};
	return (
		<div className="fixed z-50 bottom-0 pb-6 left-0 w-full bg-primary-900 py-4 flex items-center">
			<div className="w-full">
				<Grid columns="5" align="center" justify="between">
					{navs.map((nav, index) => {
						return (
							<div key={index}>
								<Flex
									direction="column"
									gap="1"
									align="center"
									className="text-primary-200 cursor-pointer"
									onClick={() => handleTabRoute(`${nav.path}`)}>
									{nav.icon}
									<span>{nav.name}</span>
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
