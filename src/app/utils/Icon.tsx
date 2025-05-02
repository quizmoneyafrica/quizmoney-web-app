import * as React from "react";
import type { IconProps } from "@radix-ui/react-icons/dist/types";

type CustomIconProps = IconProps & {
	size?: number;
	className?: string;
};

// Generic wrapper: sets default size = 20
export default function Icon({
	children,
	size = 20,
	className = "",
	...props
}: CustomIconProps & { children: React.ReactElement }) {
	return React.cloneElement(children, {
		width: size,
		height: size,
		className,
		...props,
	});
}
