"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setShowGameCountdown } from "@/app/store/gameSlice";
import React from "react";

function JoinGameBtn() {
  const dispatch = useAppDispatch();

  const handleJoinBtn = () => {
    dispatch(setShowGameCountdown(true));
  };
  return (
    <>
      <button
        onClick={handleJoinBtn}
        className="bg-white border border-white rounded-full px-4 py-1 text-primary-900 font-medium cursor-pointer flex items-center gap-1 text-nowrap"
      >
        <i className="bi bi-play-circle mb-1 relative"><i className="bi bi-play-circle mb-1 animate-ping absolute left-0 top-0"></i></i> Join Live Game!
      </button>
    </>
  );
}

export default JoinGameBtn;
