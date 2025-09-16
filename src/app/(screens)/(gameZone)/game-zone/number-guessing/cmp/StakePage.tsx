/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import QmDrawer from "@/app/components/drawer/drawer";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { useGameZone } from "@/app/hooks/useGameZone";
import {
  setGameSettings,
  setGameStatus,
} from "@/app/store/numberGuessGameSlice";
import CustomTextField from "@/app/utils/CustomTextField";
import { GameButton } from "@/app/utils/GameButton";
import { formatNaira, toastPosition } from "@/app/utils/utils";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";
import { gameRules } from "./gameRules";
import GameZoneAPI from "@/app/api/gameZoneApi";
import { DiceQ } from "@/app/icons/icons";
import { setPhase } from "@/app/store/gameSlice";
import useWalletHook from "@/app/hooks/useWallet";
import QMLoader from "@/app/components/splashScreen/QMLoader";

const preStakeAmounts = [
  { value: 1000 },
  { value: 5000 },
  { value: 10000 },
  { value: 20000 },
];
function StakePage() {
  const dispatch = useAppDispatch();
  const { fetchWallet } = useWalletHook();
  const { isFetching, currentGameData } = useGameZone("NUMBER_GUESSER");
  // const prevSessionId = localStorage.getItem("gameSessionId");
  const [confirmStakeModal, setConfirmStakeModal] = useState(false);

  const [stake, setStake] = useState<number>(0);

  if (isFetching) {
    return (
      <div className="w-full h-full grid place-items-center">
        <QMLoader />
      </div>
    );
  }

  const handleStakeInGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // if (prevSessionId) {
      //   await GameZoneAPI.leaveNumberGuessGame(prevSessionId);
      // }
      if (!currentGameData.gameId) {
        throw new Error("Game not found");
      }
      const res = await GameZoneAPI.stakeInGame(
        currentGameData.gameId,
        currentGameData.type,
        stake
      );
      dispatch(setGameSettings(res.data));
      console.log("====================================");
      console.log(res.data);
      console.log("====================================");
      localStorage.setItem("gameSessionId", res.data.sessionId);
      dispatch(setGameStatus("INPROGRESS"));
      dispatch(setPhase("playing"));
      fetchWallet();
    } catch (err: any) {
      toast.error(err.message, { position: toastPosition });
      setConfirmStakeModal(false);
    }
  };

  const handlePreStakeBtn = (amount: number) => {
    setStake(amount);
  };

  const potentialWin = stake > 0 ? stake * 2 : 0;
  return (
    <div className="w-full max-w-lg mx-auto space-y-10">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-primary-900 bg-transparent rounded-full h-14 w-14 border-4 border-primary-800 grid place-items-center mx-auto">
            <DiceQ />
          </div>
          <h2 className=" text-[2.3em] text-primary-900">Number Guessing</h2>
          <p>Guess smart, Get rewarded</p>
        </div>
        <div className="border-2 border-[#2364aab7] bg-primary-100 p-4 rounded-[10px] text-center font-bold text-sm">
          <p>Double Your Money!</p>
          <p>Win 2× Instantly!</p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <form onSubmit={handleStakeInGame} className="w-full">
          <Flex direction="column" gap="4">
            <CustomTextField
              label="Stake big win big"
              name="stake"
              value={stake ? stake.toLocaleString() : ""}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                setStake(Number(raw));
              }}
              placeholder={`Min ${formatNaira(
                Number(currentGameData.config.minimumStake)
              )}`}
              className="bg-white border-[#0a0a0a1a] text-primary-800 focus:border-primary-800 placeholder:text-sm"
              required
            />
            <div className="grid grid-cols-4 gap-2">
              {preStakeAmounts.map((st, index) => {
                return (
                  <motion.button
                    onClick={() => handlePreStakeBtn(st.value)}
                    type="button"
                    key={index}
                    className="bg-white w-full py-2 rounded-md font-medium text-sm text-primary-800 border border-[#17478b1f] hover:border-[#17478b64]"
                    whileTap={{ scale: 0.95 }}
                  >
                    {formatNaira(Number(st.value))}
                  </motion.button>
                );
              })}
            </div>
            <div className="rounded-md border border-primary-300 bg-primary-100 p-4 grid grid-cols-3 text-sm">
              <p className="font-medium">Potential Win</p>
              <div className="col-span-2">
                <p className="text-end font-bold text-primary-900">
                  {formatNaira(potentialWin)}
                </p>
              </div>
            </div>
            <QmDrawer
              open={confirmStakeModal}
              onOpenChange={setConfirmStakeModal}
              title={
                stake < Number(currentGameData.config.minimumStake)
                  ? "Stake Too Low"
                  : stake > Number(currentGameData.config.maximumStake)
                  ? "Stake Too High"
                  : "Number Guessing Rules"
              }
              titleLeft
              trigger={<GameButton text="Start Game" type="button" />}
            >
              {/* Case: valid stake */}
              {stake >= Number(currentGameData.config.minimumStake) &&
              stake <= Number(currentGameData.config.maximumStake) ? (
                <div className="space-y-6">
                  <div className="text-neutral-900 text-sm text-left space-y-4 bg-primary-100 p-4 rounded-lg">
                    {gameRules.map((rule, index) => (
                      <div key={index}>
                        <span className="font-semibold text-error-900">
                          {index + 1}. {rule.title}
                        </span>{" "}
                        – {rule.description}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">
                    By clicking the button below, you understand and agree to
                    the game rules above.
                  </p>
                  <GameButton
                    onClick={handleStakeInGame}
                    text="Yes, Proceed"
                    type="submit"
                  />
                </div>
              ) : (
                // Case: invalid stake (too low or too high)
                <div className="p-6 text-center space-y-4">
                  {stake < Number(currentGameData.config.minimumStake) && (
                    <>
                      <p className="text-red-600 font-bold text-lg">
                        🚫 Stake Too Low
                      </p>
                      <p className="text-sm text-gray-700">
                        The minimum stake allowed is{" "}
                        <span className="font-semibold text-primary-900">
                          {formatNaira(
                            Number(currentGameData.config.minimumStake)
                          )}
                        </span>
                        . Please increase your stake to continue.
                      </p>
                    </>
                  )}

                  {stake > Number(currentGameData.config.maximumStake) && (
                    <>
                      <p className="text-red-600 font-bold text-lg">
                        🚫 Stake Too High
                      </p>
                      <p className="text-sm text-gray-700">
                        The maximum stake allowed is{" "}
                        <span className="font-semibold text-primary-900">
                          {formatNaira(
                            Number(currentGameData.config.maximumStake)
                          )}
                        </span>
                        . Please reduce your stake to continue.
                      </p>
                    </>
                  )}
                  <GameButton
                    text="Okay"
                    type="button"
                    onClick={() => setConfirmStakeModal(false)}
                  />
                </div>
              )}
            </QmDrawer>
          </Flex>
        </form>
      </div>
    </div>
  );
}

export default StakePage;
