export interface LeaderboardEntry {
  rank: number;
  avatarUrl: string;
  firstName: string;
  gamesPlayed: number;
  score: number;
  totalAnswerTime: string;
  prizeWon: number;
  facebookHandle: string;
  twitterHandle: string;
  instagramHandle: string;
  tiktokHandle: string;
  whatsappContact: string;
  sessionId: string;
  rewardType: string;
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

export type LeaderboardType = "lastGame" | "allTime";
