import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";

interface GameState {
  nextGameData: ApiResponse["result"] | null;
  showGameCountdown: boolean;
  isAllowedInGame: boolean;
  liveGameData: ApiResponse["result"] | null;
}

const initialState: GameState = {
  nextGameData: null,
  showGameCountdown: true,
  isAllowedInGame: false,
  liveGameData: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setNextGameData(state, action: PayloadAction<ApiResponse["result"]>) {
      state.nextGameData = action.payload;
    },
    setShowGameCountdown(state, action: PayloadAction<boolean>) {
      state.showGameCountdown = action.payload;
    },
    setIsAllowedInGame(state, action: PayloadAction<boolean>) {
      state.isAllowedInGame = action.payload;
    },
    setLiveGameData(state, action: PayloadAction<ApiResponse["result"]>) {
      state.liveGameData = action.payload;
    },
  },
});

export const {
  setNextGameData,
  setShowGameCountdown,
  setIsAllowedInGame,
  setLiveGameData,
} = gameSlice.actions;
export default gameSlice.reducer;
