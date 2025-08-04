"use client";

import { ArrowLeft, Plus, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface GameZoneHeaderProps {
  balance: number;
  onTopUp?: () => void;
}

export default function GameZoneHeader({
  balance,
  onTopUp,
}: GameZoneHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full flex justify-between items-center py-3  text-white">
      {/* Left - Back and Title */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Game zone</h1>
      </div>

      {/* Right - Balance */}
      <button
        className="bg-white text-[#17478B] rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold cursor-pointer"
        onClick={onTopUp}
      >
        ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        <PlusCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
