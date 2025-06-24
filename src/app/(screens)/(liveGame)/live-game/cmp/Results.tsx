import AdBanner from "@/app/components/advert/adBanner";
import { setShowAdsScreen, stopAudio } from "@/app/store/gameSlice";
import CustomButton from "@/app/utils/CustomBtn";
import { Grid } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

function Results() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLeaderboard = () => {
    dispatch(setShowAdsScreen(false));
    router.replace("/home");
    dispatch(stopAudio());
  };

  return (
    <div className="min-h-[100dvh] lg:h-screen bg-primary-900 hero flex flex-col items-center justify-start pt-10 px-4">
      <div className="w-full h-full mx-auto max-w-lg space-y-6 grid gap-3 place-items-center">
        <Grid gap="3" className="w-full">
          <div>
            <button></button>
            <button></button>
          </div>
          <div className="bg-primary-50 text-center text-sm border-4 border-primary-500 rounded-[10px] px-4 py-8 space-y-6">
            <div className="space-y-3 max-w-[70%] mx-auto">
              <p className="text-3xl">🎉 </p>
              <p className="text-bold text-3xl text-primary-900">Nice game!!</p>
              <p className="text-sm">
                Leaderboard results will be available shortly. You may close the
                app and check back in a few minutes.
              </p>
            </div>

            <div className="w-full text-center space-y-4">
              <p>Check Result! Tap the button 👇</p>
              <CustomButton
                onClick={handleLeaderboard}
                width="full"
                className="md:hidden text-sm"
              >
                Check the last game Result
              </CustomButton>
              <CustomButton
                onClick={handleLeaderboard}
                width="medium"
                className="text-sm hidden md:inline-block"
              >
                Check the last game Result
              </CustomButton>
            </div>
          </div>
        </Grid>
        <AdBanner />
      </div>
    </div>
  );
}

export default Results;
