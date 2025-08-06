"use client";

import React from "react";
import GameZoneButton from "../../home/game-zone-btn";
import CustomImage from "../../wallet/CustomImage";
import classNames from "classnames";

interface GameZoneCardHomeProps {
	badgeIcon: string;
	riverLine1: string;
	riverLine2: string;
	gameZoneIcon: string;
	bgColor?: string;
	gameZoneImage: string;
	btnTitle?: string;
	caption?: string;
	onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export function GameZoneCard({
	badgeIcon,
	riverLine1,
	riverLine2,
	gameZoneIcon,
	gameZoneImage,
	bgColor = "#DFF9FF",
	onClick,
	caption = "Play games daily & win cash instantly",
	btnTitle = "Play games",
}: GameZoneCardHomeProps) {
	return (
		<div
			className={classNames(
				"bg-[#DFF9FF] rounded-3xl relative md:p-6 px-3 py-5 overflow-hidden shadow-md w-full",
				`bg-${bgColor}`
			)}>
			{/* Top Badge */}
			<div className="absolute left-0 top-0 ml-5 flex items-center justify-center z-[2000]">
				<CustomImage alt="Badge Icon" src={badgeIcon} />
			</div>

			{/* Decorative Lines (Mobile Only) */}
			<div className="absolute left-0 pb-5 bottom-0 right-0 ml-5 flex opacity-50  z-10 flex-col items-center w-full justify-center">
				<CustomImage className="w-full" alt="River Line 1" src={riverLine1} />
				<CustomImage className="w-full" alt="River Line 2" src={riverLine2} />
			</div>

			<div className="grid grid-cols-2 pt-5 ">
				{/* Left Content */}
				<div className="flex flex-col gap-3 max-w-md justify-center z-[2000]">
					<CustomImage alt="Game Zone Icon" src={gameZoneIcon} />
					<span className="text-black text-sm font-medium">{caption}</span>
					<div className="w-full flex justify-start">
						<GameZoneButton onClick={onClick} disabled>
							<span className=" shrink-0 text-sm">{btnTitle} </span>
						</GameZoneButton>
					</div>
				</div>

				{/* Right Illustration */}
				<div className="relative md:mt-0 z-50 flex justify-end">
					<CustomImage
						alt="Game Illustration"
						src={gameZoneImage}
						quality={100}
						width={100}
						height={100}
					/>
				</div>
			</div>
		</div>
	);
}
