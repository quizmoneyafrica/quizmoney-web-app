// store/leaderboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LeaderboardEntry,
  PaginatedLeaderboardResponse,
} from "../(screens)/(protected)/(tabs)/leaderboard/types";
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
  coins: number;
  totalTime: string;
  totalCorrect: number;
  result: QuestionResult[];
  user: UserProfile;
}

export interface LeaderboardRanking {
  position: number;
  prize: number;
  coins: number;
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
  lastGame: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  pagination: {
    lastGame: {
      pageNo: number;
      pageSize: number;
      totalElements: number;
      totalPages: number;
      last: boolean;
    };
    allTime: {
      pageNo: number;
      pageSize: number;
      totalElements: number;
      totalPages: number;
      last: boolean;
    };
  };
  selectedPlayer?: LeaderboardEntry | null;
}

const initialState: LeaderboardState = {
  lastGame: [],
  allTime: [],
  pagination: {
    lastGame: {
      pageNo: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
    },
    allTime: {
      pageNo: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
    },
  },
};
export type LeaderboardPlayer = LeaderboardRanking | AllTimeLeaderboardUser;

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setLastGameLeaderboard: (
      state,
      action: PayloadAction<PaginatedLeaderboardResponse>
    ) => {
      state.lastGame = action.payload.content;
      state.pagination.lastGame = {
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        last: action.payload.last,
      };
    },

    setAllTimeLeaderboard: (
      state,
      action: PayloadAction<PaginatedLeaderboardResponse>
    ) => {
      state.allTime = action.payload.content;
      state.pagination.allTime = {
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        last: action.payload.last,
      };
    },
    clearLeaderboards: (state) => {
      state.lastGame = [];
      state.allTime = [];
      state.pagination = {
        lastGame: {
          pageNo: 0,
          pageSize: 10,
          totalElements: 0,
          totalPages: 0,
          last: true,
        },
        allTime: {
          pageNo: 0,
          pageSize: 10,
          totalElements: 0,
          totalPages: 0,
          last: true,
        },
      };
    },
    setSelectedPlayer: (
      state,
      action: PayloadAction<LeaderboardEntry | null>
    ) => {
      state.selectedPlayer = action.payload;
    },
  },
});

export const {
  setLastGameLeaderboard,
  setAllTimeLeaderboard,
  clearLeaderboards,
  setSelectedPlayer,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
