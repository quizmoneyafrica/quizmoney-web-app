import React from "react";
import { LeaderboardType } from "../types";

interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
}

export default function LeaderboardTabs({
  activeTab,
  onTabChange,
}: LeaderboardTabsProps) {
  return (
    <div className="flex items-center gap-0 bg-[#E4F1FA] rounded-full p-1 mb-6">
      <button
        onClick={() => onTabChange("lastGame")}
        className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
          activeTab === "lastGame"
            ? "bg-[#2364AA] text-white shadow-sm "
            : "text-[#6D6D6D] "
        }`}
      >
        Last Game <span className="hidden md:inline">leaderboard</span>
      </button>
      <button
        onClick={() => onTabChange("allTime")}
        className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
          activeTab === "allTime"
            ? "bg-[#2364AA] text-white shadow-sm"
            : "text-[#6D6D6D] "
        }`}
      >
        All time <span className="hidden md:inline">Leaderboard</span>
      </button>
    </div>
  );
}
