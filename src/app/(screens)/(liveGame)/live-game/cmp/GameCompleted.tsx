import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { setPhase } from "@/app/store/gameSlice";
import CustomButton from "@/app/utils/CustomBtn";
import React, { useRef, useState } from "react";

function GameCompleted() {
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { liveGameData } = useAppSelector((state) => state.game);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Autoplay blocked or failed:", error);
        });
    }
  };

  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       dispatch(setPhase("result"));
  //     }, 45000);

  //     return () => clearTimeout(timeout);
  //   }, [dispatch]);
  return (
    <>
      <div className="relative w-screen h-screen bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={liveGameData?.videoAds?.url}
          className="absolute top-0 left-0 w-full h-full object-cover"
          controls={false}
          playsInline
          preload="auto"
          onEnded={() => {
            dispatch(setPhase("result"));
          }}
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <CustomButton
              onClick={handlePlay}
              type="button"
              size="md"
              className="transition"
            >
              ▶ Play Video
            </CustomButton>
          </div>
        )}
      </div>
    </>
  );
}

export default GameCompleted;
