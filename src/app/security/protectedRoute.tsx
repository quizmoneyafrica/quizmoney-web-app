"use client";

import { useAppSelector } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, rehydrated } = useAppSelector((s) => s.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (rehydrated && isAuthenticated && isMounted) {
      setChecking(false);
    } else if (rehydrated && !isAuthenticated && isMounted) {
      router.replace("/login");
    }
    return () => {
      isMounted = false;
    };
  }, [rehydrated, isAuthenticated, router]);

  if (!rehydrated || checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
          aria-label="Loading"
        />
        <p className="sr-only">Loading, please wait...</p>
      </div>
    );
  }

  return <>{children}</>;
}
