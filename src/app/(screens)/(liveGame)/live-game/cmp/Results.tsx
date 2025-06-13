import GameApi from "@/app/api/game";
import AppLoader from "@/app/components/loader/loader";
import { useAppSelector } from "@/app/hooks/useAuth";
import { setShowAdsScreen } from "@/app/store/gameSlice";
import CustomButton from "@/app/utils/CustomBtn";
import { Grid } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function Results() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { liveGameData } = useAppSelector((state) => state.game);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await GameApi.getLoggedinUserGameResults(
          liveGameData?.objectId
        );
        console.log(res.data.result);
        // console.log(res);
        setFetching(false);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.response.data.error);
        setFetching(false);
      }
    };
    fetchResult();
  }, [liveGameData?.objectId]);

  const handleLeaderboard = () => {
    dispatch(setShowAdsScreen(false));
    router.replace("/leaderboard");
  };

  if (fetching) return <AppLoader />;
  return (
    <div className="min-h-[100dvh] lg:h-screen bg-primary-900 hero flex flex-col items-center justify-start pt-10 px-4">
      <div className="w-full h-full mx-auto max-w-lg space-y-6 grid place-items-center">
        <Grid gap="3" className="w-full">
          <div>
            <button></button>
            <button></button>
          </div>
          <div className="bg-primary-50 text-center text-sm border-4 border-primary-500 rounded-[10px] px-4 py-8 space-y-6">
            <div className="space-y-3 max-w-[70%] mx-auto">
              <p className="text-3xl">🎉 </p>
              <p className="text-bold text-3xl text-primary-900">
                That was a nice game!!
              </p>
              <p className="text-sm">
                You&apos;re Quick, Sharp & Unstoppable let&apos;s see if the
                leaderboard agrees.
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
      </div>
    </div>
  );
}

export default Results;
