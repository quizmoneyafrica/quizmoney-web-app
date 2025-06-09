// store/leaderboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { LeaderboardData } from "../(screens)/(protected)/(tabs)/leaderboard/page";
export interface QuestionResult {
  number: string;
  correctAnswer: string;
  yourAnswer: string;
  correct: boolean;
  question: string;
  options: string[];
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  noOfGamesPlayed?: number;
}

export interface UserLastGameStats {
  position: number | null;
  prize: number;
  totalTime: string;
  totalCorrect: number;
  result: QuestionResult[];
  user: UserProfile;
}

export interface LeaderboardRanking {
  position: number;
  prize: number;
  totalTime: string;
  totalCorrect: number;
  user: UserProfile;
}

export interface LeaderboardData {
  msg: string;
  userLastGameStats: UserLastGameStats;
  users: string[];
  rankings: LeaderboardRanking[];
  gameId: {
    __type: "Pointer";
    className: string;
    objectId: string;
  };
  createdAt: string;
  updatedAt: string;
  objectId: string;
}
export interface AllTimeLeaderboardUser {
  noOfGamesPlayed: number;
  amountWon: number;
  userId: string;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  firstName: string;
  lastName: string;
  avatar: string;
  overallRank: number;
}

export interface AllTimeLeaderboardData {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  leaderboard: AllTimeLeaderboardUser[];
}

interface LeaderboardState {
  lastGame?: LeaderboardData;
  allTime: { [page: number]: AllTimeLeaderboardData };
}

const initialState: LeaderboardState = {
  lastGame: undefined,
  allTime: {},
};
export type LeaderboardPlayer = LeaderboardRanking | AllTimeLeaderboardUser;

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setLastGameLeaderboard: (state, action: PayloadAction<LeaderboardData>) => {
      state.lastGame = action.payload;
    },
    setAllTimeLeaderboard: (
      state,
      action: PayloadAction<{ page: number; data: AllTimeLeaderboardData }>
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
