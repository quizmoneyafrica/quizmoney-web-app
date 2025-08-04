import classNames from "classnames";
import { useRouter } from "next/navigation";
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function GameZoneButton(props: Props) {
  return (
    <button
      className={classNames(
        "bg-[#17478B] rounded-full px-4 py-1 z-[10000] text-white font-medium cursor-pointer flex items-center gap-1",
        props.className
      )}
      {...props}
    >
      <i className="bi bi-play-circle mb-1"></i> {props.children}
    </button>
  );
}
