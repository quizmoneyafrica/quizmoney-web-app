"use client";
import { Button } from "@radix-ui/themes";
import React from "react";
import { toast } from "sonner";

type Props = {
	name: string;
};

export default function Onboarding({ name }: Props) {
	const pushToast = () =>
		toast.success(`${name} Toast working`, {
			action: {
				label: "Action",
				onClick: () => console.log("Action!"),
			},
		});

	return (
		<div>
			<Button onClick={pushToast}>Push Toast</Button>
		</div>
	);
}
