"use client";
import { LogoutIcon } from "@/app/icons/icons";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";

function Page() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.25, ease: "easeInOut" }}>
			<>
				<button>
					<Flex>
						<Flex>
							<LogoutIcon /> Logout
						</Flex>
						<ArrowRightIcon />
					</Flex>
				</button>
			</>
		</motion.div>
	);
}

export default Page;
