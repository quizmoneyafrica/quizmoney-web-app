import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";

interface GameState {
  nextGameData: ApiResponse["result"] | null;
  showGameCountdown: boolean;
  isAllowedInGame: boolean;
  gameEnded: boolean;
  liveGameData: ApiResponse["result"] | null;
  showAdsScreen: boolean;
  showResultScreen: boolean;
  openLeaveGame: boolean;
}

const initialState: GameState = {
  nextGameData: null,
  showGameCountdown: true,
  isAllowedInGame: false,
  gameEnded: false,
  liveGameData: null,
  showAdsScreen: false,
  showResultScreen: false,
  openLeaveGame: false,
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
    setGameEnded(state, action: PayloadAction<boolean>) {
      state.gameEnded = action.payload;
    },
    setshowResultScreen(state, action: PayloadAction<boolean>) {
      state.showResultScreen = action.payload;
    },
    setOpenLeaveGame: (state, action: PayloadAction<boolean>) => {
      state.openLeaveGame = action.payload;
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
  setGameEnded,
  setOpenLeaveGame,
} = gameSlice.actions;
export default gameSlice.reducer;
