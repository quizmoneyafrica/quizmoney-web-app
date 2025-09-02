export interface LeaderboardEntry {
  avatarUrl: string;
  firstName: string;
  gamesPlayed: number;
  rank: number;
  score: number;
  amount?: number; // Prize amount
  totalAnswerTime?: string;
  prizeWon?: number;
}

export interface PaginatedLeaderboardResponse {
  content: LeaderboardEntry[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  totalEntries: number;
  currentPage: number;
  totalPages: number;
}

export type LeaderboardType = 'lastGame' | 'allTime';
