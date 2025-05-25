"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import React, { useState } from "react";
import { formatNaira, toastPosition } from "@/app/utils/utils";
import { setOpenLeaveGame, setShowGameCountdown } from "@/app/store/gameSlice";
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
      dispatch(setShowGameCountdown(false));
      dispatch(setOpenLeaveGame(false));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response.data.error, {
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
      {/* <Dialog.Root open={openLeaveGame}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-sm w-full focus:outline-none">
            <Dialog.Title className="text-lg font-semibold">
              Quit Game
            </Dialog.Title>
            <Dialog.Description className="text-sm mt-2 mb-6">
              Are you sure you don&apos;t want to win{" "}
              {formatNaira(liveGameData?.gamePrize)}? <br />
              Of course you do, so don&apos;t quit! 😜
            </Dialog.Description>

            <div className="flex items-center justify-end gap-3">
              {!loading ? (
                <button
                  className="ml-2 cursor-pointer border border-error-500 bg-error-100 text-error-500 w-24 h-12 px-4 py-2 rounded-[8px] flex items-center justify-center"
                  onClick={handleLeaveGame}
                >
                  Quit
                </button>
              ) : (
                <button
                  className="ml-2 cursor-pointer border border-error-500 bg-error-100 text-error-500 w-24 h-12 px-4 py-2 rounded-[8px] flex items-center justify-center"
                  disabled
                >
                  <Spinner />
                </button>
              )}

              {/* <Dialog.Close asChild> */}
      {/* <button
                onClick={() => dispatch(setOpenLeaveGame(false))}
                disabled={loading}
                className="bg-primary-500 border border-primary-500 text-neutral-50 cursor-pointer px-4 w-24 h-12 py-2 rounded-[8px] flex items-center justify-center"
              >
                Cancel
              </button> */}
      {/* </Dialog.Close> 
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}
    </>
  );
};
