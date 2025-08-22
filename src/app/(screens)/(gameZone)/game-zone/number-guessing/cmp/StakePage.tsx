import { useAppDispatch } from "@/app/hooks/useAuth";
import { StartGameBtn } from "@/app/icons/icons";
import { setGameStatus } from "@/app/store/numberGuessGameSlice";
import React from "react";

function StakePage() {
  const dispatch = useAppDispatch();
  return (
    <div className="w-full max-w-lg mx-auto space-y-10">
      <div className="space-y-4">
        <div>
          <div className="text-primary-900 bg-transparent rounded-full h-14 w-14 border-4 border-primary-800 grid place-items-center mx-auto">
            {/* <Gamepad2 /> */}
          </div>
          <h2 className="text-center text-[2.3em] text-primary-50">
            Number Guessing
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={() => dispatch(setGameStatus("INPROGRESS"))}
          className=""
        >
          <StartGameBtn className="justify-center" />
        </button>
      </div>
    </div>
  );
}

export default StakePage;
