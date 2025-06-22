"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import React, { useState } from "react";
import { formatNaira, toastPosition } from "@/app/utils/utils";
import { setOpenLeaveGame, setPhase, stopAudio } from "@/app/store/gameSlice";
import { toast } from "sonner";
import GameApi from "@/app/api/game";
import Modal from "./modal/ModalWindow";

export const LeaveGameModal = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { nextGameData, openLeaveGame } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const handleLeaveGame = async () => {
    setLoading(true);
    try {
      await GameApi.removeUserFromGame(nextGameData?.objectId);
      router.replace("/home");
      dispatch(setPhase("loading"));
      dispatch(stopAudio());
      dispatch(setOpenLeaveGame(false));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message, {
        position: toastPosition,
      });
      setLoading(false);
    }
  };
  return (
    <>
      <Modal
        handleClose={(open) => dispatch(setOpenLeaveGame(open))}
        open={openLeaveGame}
        redTitle
        title="Confirm Quit Game"
        actionBtnText="Quit Game"
        actionOnClick={handleLeaveGame}
        actionLoader={loading}
      >
        <div>
          <p>
            Are you sure you don&apos;t want to win{" "}
            {formatNaira(nextGameData?.gamePrize)}? <br />
            Of course you do, so don&apos;t quit! 😜
          </p>
        </div>
      </Modal>
    </>
  );
};
