"use client";
import AppLoader from "@/app/components/loader/loader";
import Onboarding from "@/app/components/onboarding/onboarding";
import { useAuthStore } from "@/lib/auth-store";
import { isMobileOrTablet } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function OnboardingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [deviceReady, setDeviceReady] = useState(false);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, hasHydrated, router]);

  useEffect(() => {
    if (hasHydrated && !isMobileOrTablet()) {
      router.replace("/login");
    } else {
      setDeviceReady(true);
    }
  }, [hasHydrated, router]);

  if (!hasHydrated || !deviceReady) return <AppLoader />;

  return (
    <div className="overflow-hidden">
      <Onboarding />
    </div>
  );
}

export default OnboardingPage;
