/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "./useAuth";
import { toast } from "sonner";
import { toastPosition } from "../utils/utils";
import GameZoneAPI from "../api/gameZoneApi";
import { GameTypes, setCurrentGameData } from "../store/gameZoneSlice";

export const useGameZone = (gameType: GameTypes) => {
  const dispatch = useAppDispatch();
  const currentGameData = useAppSelector((s) => s.gameZone.currentGameData);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchCurrentGameData = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await GameZoneAPI.getAGame(gameType);
      dispatch(setCurrentGameData(res.data));
      setIsFetching(false);
    } catch (err: any) {
      toast.error(err.message, { position: toastPosition });
    } finally {
      setIsFetching(false);
    }
  }, [dispatch, gameType]);

  //   useEffect(() => {
  //     fetchCurrentGameData();
  //   }, [fetchCurrentGameData]);

  return { currentGameData, fetchCurrentGameData, isFetching };
};
