import classNames from "classnames";
import React from "react";

export default function GameZoneButton(
	props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
	return (
		<button
			className={classNames(
				"bg-[#17478B] rounded-full px-4 py-1 z-[10000] text-white font-medium cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed",
				props.className
			)}
			{...props}>
			<i className="bi bi-play-circle mb-1"></i> {props.children}
		</button>
	);
}
