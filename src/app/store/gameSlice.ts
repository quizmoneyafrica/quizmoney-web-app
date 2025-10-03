import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";
import { LeaderboardEntry } from "../(screens)/(protected)/(tabs)/leaderboard/types";

export type GamePhase =
  | "loading"
  | "lobby"
  | "playing"
  | "completed"
  | "result"
  | "cancelled"
  | "demo";
export type GameStatus = "UPCOMING" | "WAITING" | "INPROGRESS" | "ENDED";

interface CurrentGameObj {
  gameId: string;
  status: GameStatus;
  fee: number;
  prize: number;
  duration: number;
  startTime: string;
  description: string;
  coinPrize: number;
  currentQuestionOrder: number;
  endTime: string;
}
export interface CurrentLiveQuestionOptionsObj {
  optionId: string;
  text: string;
}
interface CurrentLiveQuestionObj {
  id: string;
  text: string;
  options: CurrentLiveQuestionOptionsObj[];
  order: number;
}

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
  nextGameData: CurrentGameObj | null;
  showGameCountdown: boolean;
  isAllowedInGame: boolean;
  gameEnded: boolean;
  liveGameData: ApiResponse["result"] | null;
  showAdsScreen: boolean;
  showResultScreen: boolean;
  openLeaveGame: boolean;
  topGamers: LeaderboardEntry[] | [];
  phase: GamePhase;
  totalTimeUsed: number;
  optionLocked: boolean;
  audioShouldPlay: boolean;
  currentLiveQuestion?: CurrentLiveQuestionObj | null;
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
  topGamers: [],
  phase: "loading",
  audioShouldPlay: false,
  totalTimeUsed: 0,
  optionLocked: false,
  currentLiveQuestion: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setNextGameData(state, action: PayloadAction<CurrentGameObj>) {
      state.nextGameData = action.payload;
    },
    updateNextGameData(state, action: PayloadAction<Partial<CurrentGameObj>>) {
      if (state.nextGameData) {
        state.nextGameData = {
          ...state.nextGameData,
          ...action.payload,
        };
      }
    },
    setCurrentLiveQuestion: (
      state,
      action: PayloadAction<CurrentLiveQuestionObj>
    ) => {
      state.currentLiveQuestion = action.payload;
    },
    setPhase: (state, action: PayloadAction<GamePhase>) => {
      state.phase = action.payload;
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
    setTopGamers(state, action: PayloadAction<LeaderboardEntry[]>) {
      state.topGamers = action.payload;
    },
    setTotalTimeUsed(state, action: PayloadAction<number>) {
      state.totalTimeUsed = action.payload;
    },
    setOptionLocked(state, action: PayloadAction<boolean>) {
      state.optionLocked = action.payload;
    },
    playAudio: (state) => {
      state.audioShouldPlay = true;
    },
    stopAudio: (state) => {
      state.audioShouldPlay = false;
    },
  },
});

export const {
  setNextGameData,
  updateNextGameData,
  setShowGameCountdown,
  setIsAllowedInGame,
  setLiveGameData,
  setShowAdsScreen,
  setshowResultScreen,
  setGameEnded,
  setOpenLeaveGame,
  setTopGamers,
  setPhase,
  playAudio,
  stopAudio,
  setTotalTimeUsed,
  setOptionLocked,
  setCurrentLiveQuestion,
} = gameSlice.actions;
export default gameSlice.reducer;
