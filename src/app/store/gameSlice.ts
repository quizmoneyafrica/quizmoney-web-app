import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";

export interface TopGamersState {
  amountWon: number;
  avatar: string;
  facebook: string;
  firstName: string;
  instagram: string;
  noOfGamesPlayed: number;
  overallRank: number;
  twitter: string;
  userId: string;
}
interface GameState {
  nextGameData: ApiResponse["result"] | null;
  showGameCountdown: boolean;
  isAllowedInGame: boolean;
  gameEnded: boolean;
  liveGameData: ApiResponse["result"] | null;
  showAdsScreen: boolean;
  showResultScreen: boolean;
  openLeaveGame: boolean;
  topGamers: TopGamersState[] | null;
}

export const initialTopGamers = {
  amountWon: 0,
  avatar: "",
  facebook: "",
  firstName: "",
  instagram: "",
  noOfGamesPlayed: 0,
  overallRank: 0,
  twitter: "",
  userId: "",
};

const initialState: GameState = {
  nextGameData: null,
  showGameCountdown: true,
  isAllowedInGame: false,
  gameEnded: false,
  liveGameData: null,
  showAdsScreen: false,
  showResultScreen: false,
  openLeaveGame: false,
  topGamers: null,
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
    setOpenLeaveGame(state, action: PayloadAction<boolean>) {
      state.openLeaveGame = action.payload;
    },
    setTopGamers(state, action: PayloadAction<TopGamersState[]>) {
      state.topGamers = action.payload;
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
  setTopGamers,
} = gameSlice.actions;
export default gameSlice.reducer;
