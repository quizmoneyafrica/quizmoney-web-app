import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";

interface GameState {
  nextGameData: ApiResponse["result"] | null;
  showGameCountdown: boolean;
}

const initialState: GameState = {
  nextGameData: null,
  showGameCountdown: true,
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
  },
});

export const { setNextGameData, setShowGameCountdown } = gameSlice.actions;
export default gameSlice.reducer;
