"use client";
import { setShowAdsScreen, setshowResultScreen } from "@/app/store/gameSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function AdsScreen() {
  const dispatch = useDispatch();
  // const { liveGameData } = useAppSelector((state) => state.game);
  // const videoRef = useRef<HTMLVideoElement>(null);

  // const videoUrl = liveGameData?.videoAds?.url;

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.play().catch((err) => {
  //       console.warn("Autoplay failed:", err);
  //     });
  //   }
  // }, []);

  // if (!videoUrl) return null;

  // const onAdEnded = async () => {
  //   dispatch(setshowResultScreen(true));
  //   dispatch(setShowAdsScreen(false));
  // };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setshowResultScreen(true));
      dispatch(setShowAdsScreen(false));
    }, 30000); // 20 seconds

    return () => clearTimeout(timeout);
  }, [dispatch]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          controls={false}
          onEnded={onAdEnded}
        /> */}
        <div className="text-white text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto" />
          <p className="text-lg font-medium">Collating your results...</p>
          <p className="text-sm italic">please wait</p>
        </div>
      </div>
    </>
  );
}

export default AdsScreen;
