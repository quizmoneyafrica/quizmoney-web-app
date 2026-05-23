"use client";

/**
 * protectedRoute.tsx
 *
 * Guards any route that requires authentication.
 * Reads from Zustand useAuthStore — no Redux dependency.
 *
 * Waits for Zustand to hydrate from localStorage before making
 * any redirect decision, preventing a flash-redirect on first load.
 */

import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, hasHydrated, router]);

  // Wait for Zustand rehydration before rendering or redirecting
  if (!hasHydrated) return null;

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
