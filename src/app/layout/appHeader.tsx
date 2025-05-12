"use client";
import { DoubleArrowRightIcon, EraserIcon } from "@radix-ui/react-icons";
import { Container, Flex, Heading } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BellIcon, PlusIcon } from "../icons/icons";

function AppHeader() {
	const pathname = usePathname();
	const excludedPaths = ["/practice-game"];

	if (excludedPaths.includes(pathname)) return null;

	const segments = pathname
		.split("/")
		.filter(Boolean)
		.map((segment) =>
			segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
		);
	return (
		<>
			<Flex align="center" justify="between" gap="2" className="pb-4">
				<Heading
					size={{ initial: "3", lg: "5" }}
					className="capitalize flex items-center flex-wrap">
					{segments.map((segment, idx) => (
						<React.Fragment key={idx}>
							{idx > 0 && (
								<span className="mx-2">
									<DoubleArrowRightIcon />
								</span>
							)}
							{segment}
						</React.Fragment>
					))}
				</Heading>
				<Flex align="center" gap="3">
					<Container>
						<Flex>
							<EraserIcon />
                            <span>0</span>
                            <PlusIcon/>
						</Flex>
					</Container>
					<Link
						href="/notification"
						className="text-neutral-600 hover:text-primary-500">
						<BellIcon />
					</Link>
				</Flex>
			</Flex>
		</>
	);
}

export default AppHeader;
