import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";

interface GameState {
  nextGameData: ApiResponse["result"] | null;
}

const initialState: GameState = {
  nextGameData: null,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
      setNextGameData(state, action: PayloadAction<ApiResponse["result"]>) {
        state.nextGameData = action.payload;
      },
    },
  });
  
  export const { setNextGameData } = gameSlice.actions;
  export default gameSlice.reducer;