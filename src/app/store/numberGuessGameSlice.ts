import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameStatus = "START" | "STAKE" | "INPROGRESS" | "ENDED";

interface GameState {
  gameStatus: GameStatus;
}

const initialState: GameState = {
  gameStatus: "START",

};

const numberGuessGameSlice = createSlice({
  name: "numberGuess",
  initialState,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.gameStatus = action.payload;
    },
    
  },
});

export const { setGameStatus } = numberGuessGameSlice.actions;
export default numberGuessGameSlice.reducer;
