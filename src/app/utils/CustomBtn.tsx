/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "./utils";
import { Spinner } from "@radix-ui/themes";

type ButtonProps = {
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "coin";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  width?: "full" | "medium" | "inline";
  loader?: boolean;
  loaderComponent?: any;
};

const variantClasses = {
  primary: "bg-primary-900 text-white hover:bg-primary-900",
  secondary: "bg-primary-500 text-white hover:bg-primary-600",
  outline: "border border-neutral-300 text-black hover:bg-neutral-100",
  coin: "bg-info-50 text-neutral-900 hover:bg-info-50",
};

const sizeClasses = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-base px-5 py-4",
};
const widthClasses = {
  full: "w-full",
  medium: "w-[50%]",
  inline: "",
};
// vgvcgvcvnavebvc
export default function CustomButton({
  children,
  type = "button",
  variant = "primary",
  size = "lg",
  loaderComponent = Spinner,
  className = "",
  disabled = false,
  onClick,
  width = "inline",
  loader,
}: ButtonProps) {
  const LoaderComponent = loaderComponent;
  return (
    <button
      key={Math.random().toString(36).substring(2, 15)}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full cursor-pointer font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-primary-230 disabled:text-neutral-50 disabled:cursor-not-allowed",
        `${loader && "flex items-center justify-center py-4"}`,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses[width],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loader && (loaderComponent ? <LoaderComponent /> : <Spinner />)}
      {children}
    </button>
  );
}
