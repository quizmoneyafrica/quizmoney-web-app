"use client";
import { Box, Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import Onboarding from "../onboarding/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";

type Countdown = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

function calculateTimeLeft(targetDate: Date): Countdown {
	const now = new Date().getTime();
	const difference = targetDate.getTime() - now;

	if (difference <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((difference / 1000 / 60) % 60);
	const seconds = Math.floor((difference / 1000) % 60);

	return { days, hours, minutes, seconds };
}

const LaunchCountdown: React.FC = () => {
	const target = new Date("2025-06-06T19:00:00");
	const [timeLeft, setTimeLeft] = useState<Countdown>(
		calculateTimeLeft(target)
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(calculateTimeLeft(target));
		}, 1000);

		return () => clearInterval(interval);
	}, [target]);

	return (
		<>
			<Grid
				columns={{ initial: "1", md: "2" }}
				className="h-screen fixed top-0 left-0 inset-0 bg-primary-100 md:bg-white z-[10000]">
				<div className="hidden lg:inline-block">
					<Onboarding />
				</div>
				<Container className="flex items-center lg:justify-center px-4 lg:px-28 pt-8 ">
					<Flex direction="column" gap="4" className="text-center">
						<div className="lg:hidden flex items-center justify-center pb-10">
							<Image
								src="/icons/quizmoney-logo-blue.svg"
								alt="Quiz Money"
								width={100}
								height={55}
								priority
							/>
						</div>
						<Heading
							as="h1"
							size={{ initial: "6", md: "7", lg: "8" }}
							className="text-primary-900">
							<motion.span
								animate={{
									rotate: [0, -15, 15, -15, 0], // swing motion
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="inline-block">
								⏳
							</motion.span>{" "}
							<br />
							COUNTDOWN TO
							<br />
							QUIZ MONEY LAUNCH!
						</Heading>

						<Flex gap="4" align="center" justify="center">
							<CountDown title="DAYS" count={timeLeft.days} />
							<CountDown title="HOURS" count={timeLeft.hours} />
							<CountDown title="MINS" count={timeLeft.minutes} />
							<CountDown title="SEC" count={timeLeft.seconds} />
						</Flex>

						<Heading as="h2" size="6" className="text-primary-900">
							JUNE 06, 2025
						</Heading>
					</Flex>
				</Container>
			</Grid>
		</>
	);
};

export default LaunchCountdown;

type Props = {
	title: string;
	count: number;
};

const CountDown = ({ title, count }: Props) => {
	return (
		<Flex direction="column" align="center" gap="3">
			<Text className="text-primary-500">{title}</Text>
			<Box className="border-3 border-primary-50 text-primary-500 text-lg rounded-lg p-4 md:p-8 lg:p-10">
				<Text>{count}</Text>
			</Box>
		</Flex>
	);
};
