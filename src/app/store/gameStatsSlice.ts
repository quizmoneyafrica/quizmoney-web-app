import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuizResultData } from "../api/interface";

interface StoreState {
  stats: QuizResultData | null;
}

const initialState: StoreState = {
  stats: null,
};

const gameStatsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<QuizResultData>) => {
      state.stats = action.payload;
    },
  },
});

export const { setStats } = gameStatsSlice.actions;
export default gameStatsSlice.reducer;
