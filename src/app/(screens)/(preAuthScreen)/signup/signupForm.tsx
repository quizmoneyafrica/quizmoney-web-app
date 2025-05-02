import useFcmToken from "@/app/hooks/useFcmToken";
import CustomButton from "@/app/utils/CustomBtn";
import { Flex } from "@radix-ui/themes";
import React from "react";
import { toast } from "sonner";
import { IconButton } from "../login/loginForm";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@/app/icons/icons";
import Link from "next/link";
import { toastPosition } from "@/app/utils/utils";
import { useRouter } from "next/navigation";

type Props = {
	// loading?: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const SignupForm = ({ setLoading }: Props) => {
	const { notificationPermissionStatus } = useFcmToken();
    const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
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
        const email = "solomon@gmail.com";
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
	};
	const handleGoogleAuth = () => {
		toast.info("Google Sign up Coming soon", {
			position: toastPosition,
			icon: <GoogleIcon />,
		});
	};
	const handleFacebookAuth = () => {
		toast.info("Facebook Sign up Coming soon", {
			position: toastPosition,
			icon: <FacebookIcon />,
		});
	};
	const handleAppleAuth = () => {
		toast.info("Apple Sign up Coming soon", {
			position: toastPosition,
			icon: <AppleIcon />,
		});
	};

	return (
		<>
			<form onSubmit={handleSignUp}>
				<Flex direction="column" gap="4">
					<div className="pt-4 w-full">
						<CustomButton type="submit" width="full">
							Proceed
						</CustomButton>
					</div>
					<div className="pt-4 space-y-6">
						<p className="text-center text-[#6E7286]">Or sign in with</p>
						<Flex align="center" justify="center" gap="6">
							<IconButton onClick={handleGoogleAuth}>
								<GoogleIcon />
							</IconButton>
							<IconButton onClick={handleFacebookAuth}>
								<FacebookIcon />
							</IconButton>
							<IconButton onClick={handleAppleAuth}>
								<AppleIcon />
							</IconButton>
						</Flex>
						<p className="text-center">
							Already have an Account?{" "}
							<Link
								href="/login"
								className="text-primary-900 font-medium underline underline-offset-2">
								Sign in
							</Link>
						</p>
					</div>
				</Flex>
			</form>
		</>
	);
};
export default SignupForm;
