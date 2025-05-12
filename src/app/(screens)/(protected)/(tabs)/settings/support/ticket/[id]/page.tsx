"use client";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ticket = {
	status: "open",
	messages: [
		{
			id: "123",
			name: "John Doe",
			isAdmin: false,
			message: "I need help with my account",
			createdAt: "2021-01-01",
		},
		{
			id: "124",
			name: "Admin",
			isAdmin: true,
			message: "Hello, I am the admin",
			createdAt: "2021-01-01",
		},
		{
			id: "125",
			name: "John Doe",
			isAdmin: false,
			message: "I need help with my account",
			createdAt: "2021-01-01",
		},
	],
};

const Message = ({
	message,
}: {
	message: (typeof ticket.messages)[number];
}) => {
	return (
		<div
			className={`flex flex-col gap-2 min-w-[50%] ${
				message.isAdmin ? "items-end" : "items-start"
			}`}>
			<Image
				src="/assets/images/profile.png"
				alt="profile"
				width={32}
				height={32}
				className="rounded-full bg-primary-100"
			/>
			<div
				className={`flex flex-col  gap-2 p-2 rounded-lg ${
					message.isAdmin ? "bg-primary-50" : "bg-zinc-100"
				}`}>
				<div className="flex justify-between gap-2">
					<p className="text-sm font-semibold">{message.name}</p>
					<p className="text-xs text-zinc-500">{message.createdAt}</p>
				</div>
				<p className="text-sm">{message.message}</p>
			</div>
		</div>
	);
};

const Page = () => {
	const router = useRouter();
	const { id } = useParams();

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.25, ease: "easeInOut" }}
			className="pb-20">
			<Flex direction="column" gap="40px">
				<div
					onClick={() => router.back()}
					className="flex items-center gap-2 font-semibold cursor-pointer">
					<ArrowLeftIcon />
					<p>Back</p>
				</div>
				<Flex
					direction={"column"}
					gap={"20px"}
					className=" md:bg-white sm:p-5 lg:p-10 rounded-3xl">
					<div className="flex items-center md:justify-start justify-center gap-2">
						<p className="text-xl md:text-2xl font-bold">#{id}</p>

						<p
							className={`text-xs px-2  rounded-md ${
								ticket.status === "open"
									? "text-green-600 bg-green-100"
									: ticket.status === "pending"
									? "text-yellow-600 bg-yellow-100"
									: "text-red-600 bg-red-100"
							}`}>
							{ticket.status}
						</p>
					</div>

					<Flex
						direction="column"
						gap="20px"
						className="h-[68vh] overflow-y-auto">
						{ticket.messages.map((message) => (
							<Message key={message.id} message={message} />
						))}
					</Flex>

					<Flex gap="20px" align="center">
						<CustomTextField label="" placeholder="Type your message here" />

						<CustomButton className="rounded-md">Send</CustomButton>
					</Flex>
				</Flex>
			</Flex>
		</motion.div>
	);
};

export default Page;
