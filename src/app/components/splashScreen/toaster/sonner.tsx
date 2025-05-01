"use client";

import { Toaster as Sonner } from "sonner";
import type { ComponentProps } from "react";

type ToasterProps = ComponentProps<typeof Sonner> & {
	appearance?: "light" | "dark" | "system";
};

const Toaster = ({ appearance = "light", ...props }: ToasterProps) => {
	return (
		<Sonner
			theme={appearance}
			className="toaster group"
			toastOptions={{
				classNames: {
					icon: "text-primary-500 dark:text--primary-300",
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:!bg-primary-500 group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
