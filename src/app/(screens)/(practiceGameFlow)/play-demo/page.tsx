"use client";
import { usePracticeStore } from "@/lib/practice-store";
import { useSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PracticeBoard from "../components/PracticeBoard";
import PracticeResults from "../components/PracticeResults";

function Page() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const socket = useSocket();

  const {
    isActive,
    isFinished,
    loading,
    error,
    startSessionHttp,
    bindSocketSession,
  } = usePracticeStore();

  const handleStartPractice = () => {
    const chosenCategory = category.trim() || undefined;

    if (socket && socket.connected) {
      // Option B: Live real-time WebSockets setup
      bindSocketSession(socket, chosenCategory);
    } else {
      // Option A: Fallback to token-intercepted Axios API routing instance
      startSessionHttp(chosenCategory);
    }
  };
  return (
    <div>
      {/* <WelcomeScreen
        demoData={demoData}
        loading={loading}
        setLoading={setLoading}
        router={router}
      /> */}
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        {/* Configuration Hub Screen */}
        {!isActive && !isFinished && (
          <div className="w-full max-w-sm mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-black text-center">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Practice Arena
            </h1>
            <p className="text-xs text-gray-400 mt-1 mb-6">
              Test your accuracy across 10 randomized items.
            </p>

            <div className="text-left mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Filter Category (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics, History"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-4 font-medium">{error}</p>
            )}

            <button
              onClick={handleStartPractice}
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-xl disabled:bg-gray-100 disabled:text-gray-400 transition-all"
            >
              {loading ? "Generating Session..." : "Launch Session"}
            </button>
          </div>
        )}

        {/* Interactive Core Session Map Screen */}
        {isActive && !isFinished && <PracticeBoard />}

        {/* Summary Score Analytics Display Screen */}
        {isFinished && <PracticeResults />}
      </div>
    </div>
  );
}

export default Page;
