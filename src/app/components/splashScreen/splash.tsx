"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import { isMobileOrTablet } from "@/app/utils/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { NlrcIcon } from "@/app/icons";

export default function Splash() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const rehydrated = useAppSelector((s) => s.auth.rehydrated);

  useEffect(() => {
    if (!rehydrated) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/home");
      } else if (isMobileOrTablet()) {
        router.replace("/onboarding");
      } else {
        router.replace("/login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [rehydrated, isAuthenticated, router]);

  return (
    <main
      id="splash"
      className="fixed inset-0 top-0 left-0 h-screen w-full bg-primary-800 flex items-center justify-center"
    >
      <Image
        src="/icons/quizmoney-logo-white.svg"
        alt="Quiz Money"
        width={180}
        height={38}
        priority
      />
      <div className="absolute bottom-8 w-full flex items-center justify-center">
        <div className="flex items-center justify-center !font-text gap-3">
      <NlrcIcon />
      <div className="grid">
        <Text className="!text-white font-bold">Licensed by</Text>
        <Text className="!text-neutral-100 font-medium">
          National Lottery <br /> Regulatory Commission
        </Text>
      </div>
    </div>
      </div>
    </main>
  );
}
