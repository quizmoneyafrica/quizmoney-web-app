"use client";
import UserAPI from "@/app/api/userApi";
import { useAuth } from "@/app/hooks/useAuth";
import useFcmToken from "@/app/hooks/useFcmToken";
import { encryptData } from "@/app/utils/crypto";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import { capitalizeFirstLetter } from "@/app/utils/utils";
import { EyeClosedIcon, EyeOpenIcon, PersonIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const { token, notificationPermissionStatus } = useFcmToken();
	const { loginUser } = useAuth();
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		if (
			notificationPermissionStatus &&
			notificationPermissionStatus !== "granted"
		) {
			toast.info(`Notification is not set for Quiz Money`, {
				position: "bottom-right",
			});
		}
		if (!email || !password) {
			toast.error(`Email and password are required.`, {
				position: "top-center",
			});
			setLoading(false);
			return;
		}
		const newValues = {
			email: email.toLowerCase().trim(),
			password: password,
			deviceToken: token || "",
		};
		try {
			const response = await UserAPI.login(newValues);
			const userData = response.data.result;

			// console.log("Logging in with:", response.data.result);

			// 🔐 Encrypt the user data
			const encryptedUser = encryptData(userData);
			console.log("Encrypted: ", encryptedUser);

			// ✅ Dispatch to Redux
			loginUser(encryptedUser);

			toast.success(
				`Welcome Back ${capitalizeFirstLetter(userData?.firstName)}`,
				{
					position: "top-center",
				}
			);
			router.replace("/home");

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log("ERROR LOGIN", err.message);
			toast.error(`${err.message}`, {
				position: "top-center",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleLogin}>
				<Flex direction="column" gap="4">
					<CustomTextField
						label="Email"
						name="email"
						value={email}
						type="email"
						autoComplete="email"
						placeholder="Enter your email"
						onChange={(e) => setEmail(e.target.value)}
						icon={<PersonIcon />}
					/>
					<CustomTextField
						label="Password"
						name="password"
						value={password}
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						placeholder="Enter your password"
						onChange={(e) => setPassword(e.target.value)}
						icon={
							showPassword ? (
								<EyeOpenIcon onClick={() => setShowPassword(false)} />
							) : (
								<EyeClosedIcon onClick={() => setShowPassword(true)} />
							)
						}
					/>

					<Flex justify="end">
						<Link href="/forgot-password">Forgot your password?</Link>
					</Flex>
					<CustomButton type="submit">
						{loading ? "Logging in..." : "Login"}
					</CustomButton>
				</Flex>
			</form>
		</div>
	);
}

export default LoginForm;
