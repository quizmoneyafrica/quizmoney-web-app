"use client";
import { setShowAdsScreen, setshowResultScreen } from "@/app/store/gameSlice";
import { Grid } from "@radix-ui/themes";
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
      <div className="min-h-screen lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
        <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
          {/* <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          controls={false}
          onEnded={onAdEnded}
        /> */}
          <Grid gap="3" className="w-full">
            {/* body  */}
            <div className="bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-900 border-t-transparent mx-auto" />
              <p className="text-lg font-medium">Collating results...</p>
              <p className="text-sm italic">please wait</p>
            </div>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default AdsScreen;
