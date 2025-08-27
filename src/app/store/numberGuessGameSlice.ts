import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameStatus = "START" | "STAKE" | "INPROGRESS" | "ENDED";

interface GameSettings {
  sessionId: string;
}
interface GameState {
  gameStatus: GameStatus;
  gameSettings: GameSettings;
}

const initialState: GameState = {
  gameStatus: "START",
  gameSettings: {
    sessionId: "",
  },
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
  },
});

export const { setGameStatus, setGameSettings } = numberGuessGameSlice.actions;
export default numberGuessGameSlice.reducer;
