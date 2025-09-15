/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusIcon } from "@/app/icons/icons";
import CustomTextField from "@/app/utils/CustomTextField";
import { GameButton } from "@/app/utils/GameButton";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QmDrawer from "@/app/components/drawer/drawer";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import GameZoneAPI from "@/app/api/gameZoneApi";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import {
  setGameSettings,
  setGameStatus,
} from "@/app/store/numberGuessGameSlice";
import PurchaseTrials from "./PurchaseTrials";
import OutOfTrialsComponent from "./OutOfTrialsComponent";
interface gameTry {
  guessDirection: "TOO_HIGH" | "TOO_LOW" | "EXACT" | string;
  result: "WON" | "IN_PROGRESS" | string;
}
function InProgress() {
  const dispatch = useAppDispatch();
  const { gameSettings } = useAppSelector((s) => s.numberGuess);
  const min = gameSettings.lowerBound;
  const max = gameSettings.upperBound;

  const [guess, setGuess] = useState("");
  const [trials, setTrials] = useState<number>(3);
  const [guessResponse, setGuessResponse] = useState<gameTry>({
    guessDirection: "",
    result: "",
  });
  const [isGuessing, setIsGuessing] = useState(false);
  const prevSessionId = localStorage.getItem("gameSessionId");

  const [openBuyModal, setOpenBuyModal] = useState<boolean>(false);
  const [openBuyModal2, setOpenBuyModal2] = useState<boolean>(false);

  //Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);

  const handleSubmitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (guessResponse.result === "WON" || trials <= 0) return;

    if (trials > 0) {
      const numGuess = Number(guess);
      if (isNaN(numGuess)) {
        toast.info("Please enter a valid number", { position: toastPosition });
        return;
      }
      setIsGuessing(true);
      try {
        const res = await GameZoneAPI.submitGuess(
          numGuess,
          gameSettings.sessionId,
          2424
        );
        setTrials((t) => t - 1);
        setGuessResponse(res.data);
        if (res.data.result === "TOO_LOW" || res.data.result === "TOO_HIGH") {
          wrongSoundRef.current?.play();
        }
        if (res.data.result === "WON") {
          localStorage.removeItem("gameSessionId");
          dispatch(setGameStatus("ENDED"));
          dispatch(
            setGameSettings({
              sessionId: "",
              upperBound: 0,
              lowerBound: 0,
              range: 0,
            })
          );
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err.message, { position: toastPosition });
      } finally {
        setIsGuessing(false);
      }
    } else if (trials <= 0) {
      try {
        if (prevSessionId) {
          await GameZoneAPI.leaveNumberGuessGame(prevSessionId);
          dispatch(setGameStatus("START"));
          dispatch(
            setGameSettings({
              sessionId: "",
              upperBound: 0,
              lowerBound: 0,
              range: 0,
            })
          );
          localStorage.removeItem("gameSessionId");
        }
      } catch (err: any) {
        toast.error(err.message, { position: toastPosition });
      }
    } else if (guessResponse.result === "WON") {
      dispatch(setGameStatus("ENDED"));
      dispatch(
        setGameSettings({
          sessionId: "",
          upperBound: 0,
          lowerBound: 0,
          range: 0,
        })
      );
    }

    // if (numGuess === hiddenNumber) {
    //   setMessage(`Correct`);
    //   setTrials((t) => t - 1);
    //   setWon(true);
    // } else if (numGuess > hiddenNumber) {
    //   setMessage("Too High!");
    //   setTrials((t) => t - 1);
    // } else {
    //   setMessage("Too Low!");
    //   setTrials((t) => t - 1);
    // }
  };

  return (
    <Fragment>
      <div className="w-full max-w-lg mx-auto space-y-10">
        <div className="space-y-4">
          <h2 className="text-center text-[2.3em] text-primary-900">
            Guess the Number
          </h2>
          <div className="flex items-center">
            <div className="animate-bounce  bg-[#2364AA] shadow-[0px_3px_0px_0px_rgba(81,162,224,1.00)] flex items-center justify-center text-white font-bold text-sm w-15 h-12 rounded-full  border-[3px] border-white">
              <span>{min}</span>
            </div>
            <div className="border-t border-dashed flex-1 border-[#2364AA] relative">
              <div className="absolute -top-0.5 inset-0 z-[2] flex items-center justify-center">
                <span className="text-primary-900 bg-primary-50 font-bold px-3.5">
                  Number Range
                </span>
              </div>
            </div>
            <div className="animate-bounce [animation-delay:-.3s] bg-[#2364AA] shadow-[0px_3px_0px_0px_rgba(81,162,224,1.00)] flex items-center justify-center text-white font-bold text-sm w-15 h-12  rounded-full  border-[3px] border-white">
              <span>{max}</span>
            </div>
          </div>
        </div>

        {/* form  */}
        <form onSubmit={handleSubmitGuess} className="w-full space-y-6">
          <CustomTextField
            label="Enter your guess"
            name="guess"
            type="text"
            value={guess}
            inputMode="numeric"
            pattern="[0-9]*"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
            }}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={`${min}`}
            className="bg-white border-[#0a0a0a1a] text-primary-800 focus:border-primary-800 placeholder:text-sm"
            required
            disabled={trials <= 0}
          />
          <div className="w-full text-center space-y-6">
            <div className="flex items-center justify-center flex-wrap gap-2">
              <p
                className={`${
                  trials === 3 ? "text-[#3C9B06]" : "text-error-600"
                }`}
              >
                ⚡ {trials} {trials === 1 ? "Trial" : "Trials"} Remaining
              </p>
              <div>
                {/* {trials <= 0 && guessResponse.result !== "WON" && ( */}
                <QmDrawer
                  open={openBuyModal}
                  handler={false}
                  hideCloseBtn={false}
                  onOpenChange={setOpenBuyModal}
                  title=""
                  heightClass="h-[100svh] md:h-[45%] lg:h-[65%]"
                  titleLeft
                  trigger={
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      // onClick={buyTrials}
                      className="flex items-center gap-1 bg-white px-4 py-1.5 border border-primary-800 text-primary-800 rounded-[20px] text-sm font-medium "
                    >
                      Buy Trials <PlusIcon />
                    </motion.button>
                  }
                >
                  <OutOfTrialsComponent
                    setOpenBuyModal2={setOpenBuyModal2}
                    setOpenBuyModal={setOpenBuyModal}
                  />
                </QmDrawer>
                {/*)}*/}
              </div>
            </div>
            <div className="space-y-2">
              <div
                className={`h-[6em] w-[6em] mx-auto rounded-full border-3 text-lg  ${
                  guessResponse.result === "WON"
                    ? "border-positive-800 text-positive-800"
                    : trials === 3
                    ? "border-[#2364AA] text-[#2364AA]"
                    : "border-[#CF0105] text-[#CF0105]"
                } bg-white grid place-items-center`}
              >
                {guessResponse.guessDirection ? (
                  formatText(guessResponse.guessDirection)
                ) : (
                  <span className="font-bold text-5xl">?</span>
                )}
              </div>
              {guessResponse.result !== "WON" &&
                trials > -1 &&
                guessResponse.guessDirection && (
                  <p className="text-[#CF0105] flex items-center gap-1 justify-center">
                    <ReloadIcon />
                    Try again
                  </p>
                )}
            </div>
          </div>
          <div className="pt-6">
            <GameButton
              text={`${trials > 0 ? "Guess" : "Leave Game"}`}
              type="submit"
              disabled={isGuessing}
            />
          </div>
        </form>
      </div>

      <QmDrawer
        open={openBuyModal2}
        onOpenChange={setOpenBuyModal2}
        title="Buy Extra Trials"
        titleLeft
        trigger={<></>}
      >
        <PurchaseTrials
          setTrials={setTrials}
          setOpenBuyModal={setOpenBuyModal2}
        />
      </QmDrawer>
    </Fragment>
  );
}

export default InProgress;

function formatText(input: string): string {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
