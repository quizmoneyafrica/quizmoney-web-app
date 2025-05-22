"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import { setShowAdsScreen, setshowResultScreen } from "@/app/store/gameSlice";
import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

function AdsScreen() {
  const dispatch = useDispatch();
  const { liveGameData } = useAppSelector((state) => state.game);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = liveGameData?.videoAds?.url;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });
    }
  }, []);

  if (!videoUrl) return null;

  const onAdEnded = async () => {
    dispatch(setshowResultScreen(true));
    dispatch(setShowAdsScreen(false));
  };
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          controls={false}
          onEnded={onAdEnded}
        />
      </div>
    </>
  );
}

export default AdsScreen;
