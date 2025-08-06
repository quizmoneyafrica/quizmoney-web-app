"use client";

import React from "react";
import { motion } from "framer-motion";
import { GameZoneCard } from "./game-zone-card";
import GameZoneHeader from "./game-zone-header";

const cardVariants = {
	hidden: { opacity: 0, y: 40 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.4,
			duration: 0.8,
			ease: "easeOut",
		},
	}),
};

function GameZoneLayout() {
	return (
		<div className="min-h-screen bg-primary-900 opacity-90 pb-8 hero flex flex-col items-center px-4">
			{/* Header */}
			<div className="w-full mx-auto max-w-xl mt-2">
				<GameZoneHeader
					balance={5000}
					onTopUp={() => console.log("Top up clicked")}
				/>
			</div>

			{/* Game Cards */}
			<div className="w-full mx-auto max-w-xl space-y-5 mt-8">
				<div className="w-full">
					<span className="text-sm text-white">
						Join the fun🤩. Play daily🎮. Win real cash🤑.
					</span>
				</div>

				{[
					{
						bgColor: "#DFF9FF",
						badgeIcon: "/icons/tabler_badge-filled.svg",
						riverLine1: "/icons/riverline1.svg",
						riverLine2: "/icons/riverline2.svg",
						gameZoneIcon: "/icons/pscore.svg",
						gameZoneImage: "/assets/images/perfect.png",
						caption: "Win 3x your stake! Answering trivia questions.",
					},
					{
						bgColor: "#E4F4FF",
						badgeIcon: "/icons/tabler_badge-filled.svg",
						riverLine1: "/icons/num_river_line1.svg",
						riverLine2: "/icons/num_river_line2.svg",
						gameZoneIcon: "/icons/num_guess.svg",
						gameZoneImage: "/assets/images/number_guessing.png",
						caption: "Guess the correct number within 5 chances",
					},
					{
						bgColor: "#E7FEED",
						badgeIcon: "/icons/tabler_badge-filled.svg",
						riverLine1: "/icons/money_river_line1.svg",
						riverLine2: "/icons/money_river_line2.svg",
						gameZoneIcon: "/icons/memory_game.svg",
						gameZoneImage: "/assets/images/memory_game.png",
						caption: "Match all cards before time runs out",
					},
				].map((card, i) => (
					<motion.div
						key={i}
						custom={i}
						variants={cardVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}>
						<GameZoneCard
							bgColor={card.bgColor}
							badgeIcon={card.badgeIcon}
							riverLine1={card.riverLine1}
							riverLine2={card.riverLine2}
							gameZoneIcon={card.gameZoneIcon}
							gameZoneImage={card.gameZoneImage}
							caption={card.caption}
							btnTitle="Coming soon"
							onClick={undefined}
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
}

export default GameZoneLayout;
