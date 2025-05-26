// store/leaderboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeaderboardData } from "../(screens)/(protected)/(tabs)/leaderboard/page";

interface LeaderboardState {
  lastGame?: LeaderboardData;
  allTime: { [page: number]: LeaderboardData }; // cache by page number
}

const initialState: LeaderboardState = {
  lastGame: undefined,
  allTime: {},
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setLastGameLeaderboard: (state, action: PayloadAction<LeaderboardData>) => {
      state.lastGame = action.payload;
    },
    setAllTimeLeaderboard: (
      state,
      action: PayloadAction<{ page: number; data: LeaderboardData }>
    ) => {
      state.allTime[action.payload.page] = action.payload.data;
    },
    clearLeaderboards: (state) => {
      state.lastGame = undefined;
      state.allTime = {};
    },
  },
});

export const {
  setLastGameLeaderboard,
  setAllTimeLeaderboard,
  clearLeaderboards,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
