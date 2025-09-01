import { useAppDispatch } from "@/app/hooks/useAuth";
import { setPhase } from "@/app/store/gameSlice";
import {
  setGameSettings,
  setGameStatus,
} from "@/app/store/numberGuessGameSlice";
import { GameButton } from "@/app/utils/GameButton";
import { formatNaira } from "@/app/utils/utils";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function ResultScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleWalletNav = () => {
    router.replace("/wallet");
    dispatch(setPhase("cancelled"));
    dispatch(setGameStatus("START"));
    dispatch(
      setGameSettings({
        sessionId: "",
        upperBound: 0,
        lowerBound: 0,
        range: 0,
      })
    );
  };
  const handlePlayAgain = () => {
    dispatch(setPhase("cancelled"));
    dispatch(setGameStatus("START"));
    dispatch(
      setGameSettings({
        sessionId: "",
        upperBound: 0,
        lowerBound: 0,
        range: 0,
      })
    );
  };
  return (
    <div className="w-full max-w-lg mx-auto space-y-10">
      <div className="relative rounded-xl drop-shadow-md">
        <div className="absolute inset-x-0 top-1 h-full rounded-[33px] bg-[#C2CDD5]" />

        <div className="relative p-6 h-full w-full rounded-[33px] bg-[#E4F1FA]">
          <div className="text-center space-y-4">
            <h2>You guessed the correct number</h2>

            <Trophy fill="#FBB23A" className="text-[#FBB23A] drop-shadow " />

            <span>Reward</span>
            <p>{formatNaira(Number(10000))}</p>
            <GameButton
              text="GO TO WALLET"
              type="button"
              onClick={handleWalletNav}
            />
            <GameButton
              text="PLAY AGAIN"
              type="button"
              onClick={handlePlayAgain}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
