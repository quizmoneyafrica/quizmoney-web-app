import { useAppSelector } from "@/app/hooks/useAuth";
import { CorrectCircleIcon, WrongCircleIcon } from "@/app/icons/icons";
import { setShowAdsScreen, setshowResultScreen } from "@/app/store/gameSlice";
import CustomButton from "@/app/utils/CustomBtn";
import {
  formatNaira,
  parseTimeStringToMilliseconds,
  readTotalTime,
} from "@/app/utils/utils";
import { Grid, Separator } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

function ResultScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { liveGameData } = useAppSelector((state) => state.game);
  const totalTimeUsed = "00:20:00";
  const totalCorrect = 10;

  const handleHome = () => {
    dispatch(setShowAdsScreen(false));
    dispatch(setshowResultScreen(false));
    router.replace("/home");
  };
  return (
    <div className="min-h-screen lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
      <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
        <Grid gap="3" className="w-full">
          <h2 className="text-center text-neutral-50 font-heading font-bold text-lg">
            Result
          </h2>
          <div className="bg-primary-50 text-sm border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
            <p className="text-center">
              Total Time Used:{" "}
              <span className="font-medium">
                {readTotalTime(parseTimeStringToMilliseconds(totalTimeUsed))}
              </span>
            </p>
            <Grid
              columns="3"
              align="center"
              justify="center"
              className="w-full place-items-center"
            >
              <div className="flex items-center gap-2 font-medium">
                <span>{totalCorrect} Correct</span>
                <CorrectCircleIcon className="text-positive-700" />
              </div>
              <Separator orientation="vertical" size="2" />
              <div className="flex items-center justify-end gap-2 font-medium">
                <span>
                  {Number(liveGameData?.questions.length) -
                    Number(totalCorrect)}{" "}
                  Incorrect
                </span>
                <WrongCircleIcon className="text-error-400" />
              </div>
            </Grid>
          </div>
          {/* body  */}
          <div className="bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
            <div className="space-y-2">
              <span className="text-7xl">🏆</span>
              <p className="text-sm">Yaaaaaayyy!!!</p>
              <p className="font-medium">Congratulations You Won! 🎉 </p>
              <h3 className="font-bold text-2xl text-primary-900">
                {formatNaira(1000000)}
              </h3>
            </div>
          </div>
        </Grid>
        <div className="w-full ">
          <CustomButton
            onClick={handleHome}
            width="full"
            className="!bg-secondary-500 !text-neutral-900"
          >
            Go back to Home
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
