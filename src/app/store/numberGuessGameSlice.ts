import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameStatus =
  | "START"
  | "STAKE"
  | "INPROGRESS"
  | "ENDED"
  | "PURCHASE_TRIAL"
  | "LOST"
  | "WON";

interface GameSettings {
  sessionId: string;
  upperBound: number;
  lowerBound: number;
  range: number;
}
interface GameState {
  gameStatus: GameStatus;
  gameSettings: GameSettings;
  trials: number;
  openBuyModal?: boolean;
  extraTrialBought: number;
}

const initialState: GameState = {
  gameStatus: "START",
  gameSettings: {
    sessionId: "",
    upperBound: 0,
    lowerBound: 0,
    range: 0,
  },
  trials: 3,
  openBuyModal: false,
  extraTrialBought: 0,
};

const numberGuessGameSlice = createSlice({
  name: "numberGuess",
  initialState,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.gameStatus = action.payload;
    },
    setGameSettings: (state, action: PayloadAction<GameSettings>) => {
      state.gameSettings = action.payload;
    },
    setTrials: (state, action: PayloadAction<number>) => {
      state.trials = action.payload;
    },
    decrementTrials: (state) => {
      state.trials = Math.max(0, state.trials - 1);
    },
    resetTrials: (state, action: PayloadAction<number>) => {
      state.trials = action.payload;
    },
    setOpenBuyModal: (state, action: PayloadAction<boolean>) => {
      state.openBuyModal = action.payload;
    },
    setExtraTrialBought: (state, action: PayloadAction<number>) => {
      state.extraTrialBought = action.payload;
    },
  },
});

export const {
  setGameStatus,
  setGameSettings,
  setTrials,
  decrementTrials,
  resetTrials,
  setOpenBuyModal,
  setExtraTrialBought,
} = numberGuessGameSlice.actions;
export default numberGuessGameSlice.reducer;
