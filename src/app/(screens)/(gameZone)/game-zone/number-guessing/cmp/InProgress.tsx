import { PlusIcon } from "@/app/icons/icons";
import CustomTextField from "@/app/utils/CustomTextField";
import { GameButton } from "@/app/utils/GameButton";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QmDrawer from "@/app/components/drawer/drawer";

function InProgress() {
  const min = 100;
  const max = 200;
  // hidden random number
  const [hiddenNumber] = useState(
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [trials, setTrials] = useState(3);
  const [won, setWon] = useState(false);

  const [openBuyModal, setOpenBuyModal] = useState(false);

  //Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (won || trials <= 0) return;

    const numGuess = Number(guess);
    if (isNaN(numGuess)) {
      setMessage("Please enter a valid number");
      return;
    }

    if (numGuess === hiddenNumber) {
      setMessage(`Correct`);
      setTrials((t) => t - 1);
      setWon(true);
    } else if (numGuess > hiddenNumber) {
      setMessage("Too High!");
      setTrials((t) => t - 1);
    } else {
      setMessage("Too Low!");
      setTrials((t) => t - 1);
    }
  };

  const buyTrials = () => {
    setTrials((t) => t + 2);
    setMessage("2 extra trials!");
    setOpenBuyModal(false);
  };
  return (
    <div className="w-full max-w-lg mx-auto space-y-10">
      <div className="space-y-4">
        <h2 className="text-center text-[2.3em] text-primary-900">
          Guess the Number {hiddenNumber}
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
              {trials <= 0 && !won && (
                <QmDrawer
                  open={openBuyModal}
                  onOpenChange={setOpenBuyModal}
                  title="Buy Extra Trials"
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
                  <div>
                    <form onSubmit={buyTrials}>
                      <div>
                        <div>
                          <CustomTextField
                            label="Trial Quantity"
                            name="guess"
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder={`${min}`}
                            className="bg-white border-[#0a0a0a1a] text-primary-800 focus:border-primary-800 placeholder:text-sm"
                            required
                          />
                        </div>
                        <span>
                          <span>Note:</span>You can purchase maximum of 2 Trials
                          only per game session.
                        </span>
                      </div>
                      <GameButton text="Buy Trial" type="submit" />
                    </form>
                  </div>
                </QmDrawer>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div
              className={`h-[6em] w-[6em] mx-auto rounded-full border-3 text-lg  ${
                won
                  ? "border-positive-800 text-positive-800"
                  : trials === 3
                  ? "border-[#2364AA] text-[#2364AA]"
                  : "border-[#CF0105] text-[#CF0105]"
              } bg-white grid place-items-center`}
            >
              {message ? (
                message
              ) : (
                <span className="font-bold text-5xl">?</span>
              )}
            </div>
            {!won && trials > -1 && message && (
              <p className="text-[#CF0105] flex items-center gap-1 justify-center">
                <ReloadIcon />
                Try again
              </p>
            )}
          </div>
        </div>
        <div className="pt-6">
          <GameButton text="Validate" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default InProgress;
