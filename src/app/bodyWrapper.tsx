// components/BodyWrapper.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const routeToBodyClass: Record<string, string> = {
  "/login": "bg-auth",
  "/account-created": "bg-auth",
  "/forgot-password": "bg-auth",
  "/password-changed": "bg-auth",
  "/reset-password": "bg-auth",
  "/signup": "bg-auth",
  "/verify-email": "bg-auth",
  "/verify-forgot-password": "bg-auth",
  "/": "bg-primary-500",
  "/onboarding": "bg-primary-50",
  "/play-demo": "bg-primary-50",
};

export default function BodyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset previous classes
    document.body.className = "";

    // Match and apply class
    const matchedRoute = Object.keys(routeToBodyClass).find((route) =>
      pathname.startsWith(route)
    );
    if (matchedRoute) {
      document.body.classList.add(routeToBodyClass[matchedRoute]);
    }
  }, [pathname]);

  return <>{children}</>;
}
