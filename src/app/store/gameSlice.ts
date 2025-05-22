import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";

interface GameState {
  nextGameData: ApiResponse["result"] | null;
  showGameCountdown: boolean;
  isAllowedInGame: boolean;
  liveGameData: ApiResponse["result"] | null;
  showAdsScreen: boolean;
  showResultScreen: boolean;
}

const initialState: GameState = {
  nextGameData: null,
  showGameCountdown: true,
  isAllowedInGame: false,
  liveGameData: null,
  showAdsScreen: false,
  showResultScreen: false,
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
    setShowAdsScreen(state, action: PayloadAction<boolean>) {
      state.showAdsScreen = action.payload;
    },
    setshowResultScreen(state, action: PayloadAction<boolean>) {
      state.showResultScreen = action.payload;
    },
  },
});

export const {
  setNextGameData,
  setShowGameCountdown,
  setIsAllowedInGame,
  setLiveGameData,
  setShowAdsScreen,
  setshowResultScreen,
} = gameSlice.actions;
export default gameSlice.reducer;
