import GameApi from "@/app/api/game";
import { useAppSelector } from "@/app/hooks/useAuth";
import { CorrectCircleIcon, WrongCircleIcon } from "@/app/icons/icons";
import { setShowAdsScreen } from "@/app/store/gameSlice";
import CustomButton from "@/app/utils/CustomBtn";
import {
  formatNaira,
  parseTimeStringToMilliseconds,
  readTotalTime,
} from "@/app/utils/utils";
import { Grid, Separator } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import AppLoader from "../loader/loader";

type GameResult = {
  userId: string;
  result: {
    number: string;
    correctAnswer: string;
    yourAnswer: string;
    correct: boolean;
  }[];
  totalCorrect: number;
  totalTime: string; // Format: "MM:SS:MS" (e.g., "00:29:80")
  timeRank: number;
  prize: number;
};
const initialGameResult: GameResult = {
  userId: "",
  result: Array.from({ length: 10 }, (_, i) => ({
    number: (i + 1).toString(),
    correctAnswer: "",
    yourAnswer: "",
    correct: false,
  })),
  totalCorrect: 0,
  totalTime: "00:00:00",
  timeRank: 0,
  prize: 0,
};

function ResultScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { liveGameData } = useAppSelector((state) => state.game);
  const [resultData, setResultData] = useState<GameResult>(initialGameResult);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await GameApi.getLoggedinUserGameResults(
          liveGameData?.objectId
        );
        setResultData(res.data.result);
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
    <div className="min-h-screen lg:h-screen bg-primary-900 hero flex flex-col items-center justify-start pt-10 px-4">
      <div className="w-full h-full mx-auto max-w-lg space-y-6 grid place-items-center">
        <Grid gap="3" className="w-full">
          <h2 className="text-center text-neutral-50 font-heading font-bold text-lg">
            Result
          </h2>
          <div className="bg-primary-50 text-sm border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
            <p className="text-center">
              Total Time Used:{" "}
              <span className="font-medium">
                {readTotalTime(
                  parseTimeStringToMilliseconds(resultData?.totalTime)
                )}
              </span>
            </p>
            <Grid
              columns="3"
              align="center"
              justify="center"
              className="w-full place-items-center"
            >
              <div className="flex items-center gap-2 font-medium">
                <span>{resultData?.totalCorrect} Correct</span>
                <CorrectCircleIcon className="text-positive-700" />
              </div>
              <Separator orientation="vertical" size="2" />
              <div className="flex items-center justify-end gap-2 font-medium">
                <span>
                  {Math.max(
                    (liveGameData?.questions?.length ?? 0) -
                      (resultData?.totalCorrect ?? 0),
                    0
                  )}{" "}
                  Incorrect
                </span>
                <WrongCircleIcon className="text-error-400" />
              </div>
            </Grid>
          </div>
          {/* body  */}
          <div className="bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
            {resultData?.prize !== 0 ? (
              <div className="space-y-2">
                <p className="text-7xl">🏆</p>
                <p className="text-sm">Yaaaaaayyy!!!</p>
                <p className="font-medium">Congratulations, you won! </p>
                <h3 className="font-bold text-2xl text-primary-900">
                  {formatNaira(resultData?.prize, true)}
                </h3>
              </div>
            ) : (
              <>
                {/* Not win  */}
                <div className="space-y-4">
                  <p className="text-7xl">😢</p>
                  {/* <p className="text-sm">Better luck next time</p> */}
                  <p className="font-medium">
                    Sorry, you didn&apos;t win this time
                  </p>
                </div>
              </>
            )}
          </div>
        </Grid>
        <div className="w-full ">
          <CustomButton
            onClick={handleLeaderboard}
            width="full"
            className="!bg-secondary-500 !text-neutral-900"
          >
            View Leaderboard
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
