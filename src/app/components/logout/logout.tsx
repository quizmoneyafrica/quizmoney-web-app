"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { logout } from "@/app/store/authSlice";
import React, { useState } from "react";

type Props = {
	children: React.ReactNode;
};

const LogoutDialog = ({ children }: Props) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);

	const handleLogout = () => {
		setLoading(true);
		dispatch(logout());
		router.replace("/login");
		setLoading(false);
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
				<Dialog.Content className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-sm w-full focus:outline-none">
					<Dialog.Title className="text-lg font-semibold">Log Out</Dialog.Title>
					<Dialog.Description className="text-sm text-gray-600 mt-2 mb-6">
						Are you sure you want to log out of Quiz Money?
					</Dialog.Description>

					<Flex gap="3" justify="end">
						<Dialog.Close asChild>
							<button className="bg-gray-200 cursor-pointer px-4 py-2 rounded-[8px]">
								Cancel
							</button>
						</Dialog.Close>
						{!loading ? (
							<button
								className="ml-2 cursor-pointer bg-error-900 text-neutral-50 px-4 py-2 rounded-[8px]"
								onClick={handleLogout}>
								Log Out
							</button>
						) : (
							<button
								className="ml-2 cursor-pointer bg-error-900 text-neutral-50 px-4 py-2 rounded-[8px]"
								onClick={handleLogout}>
								Log Out
							</button>
						)}
					</Flex>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default LogoutDialog;
