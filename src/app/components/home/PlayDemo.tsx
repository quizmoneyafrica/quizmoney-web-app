"use client";
import { useRouter } from "next/navigation";
import React from "react";

function PlayDemoBtn() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/play-demo")}
      className="bg-white border border-white rounded-full px-4 py-1 text-primary-900 font-medium cursor-pointer flex items-center gap-1"
    >
      <i className="bi bi-play-circle mb-1"></i> Play Demo
    </button>
  );
}

export default PlayDemoBtn;
