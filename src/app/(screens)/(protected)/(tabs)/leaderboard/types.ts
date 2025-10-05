export interface LeaderboardEntry {
 rank: number;
  avatarUrl: string;
  prizeWon:number;
  firstName: string;
  gamesPlayed: number;
  score: number;
  totalAnswerTime: string;
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
