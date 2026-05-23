/**
 * useLastGameState.tsx
 *
 * Thin wrapper around the React Query hook for the player's last game
 * performance. Keeps the same return shape as the old manual hook so
 * existing consumers need minimal changes.
 *
 * Old implementation called LeaderboardAPI.userLastGameStat() directly
 * with manual useState/useEffect — that API method no longer exists.
 *
 * New implementation delegates to useMyLastGamePerformance() which calls
 * GET /api/leaderboard/my-last-game-performance via React Query.
 *
 * Usage (unchanged from before):
 *   const { gameState, loading, error, refetch } = useLastGameState()
 */

'use client'

import { useMyLastGamePerformance } from '@/lib/queries'

export interface GameStatResult {
  score: number
  rank: number
  firstName: string
  avatarUrl: string
  totalAnswerTime: string
  questionsAnswered: QuestionsAnswered[]
  rewardType: string
  /** Prize won in KOBO — divide by 100 for naira display */
  prizeWon: number
}

interface QuestionsAnswered {
  questionText: string
  questionOptions: QuestionOption[]
  customerAnswer: string
  isCorrect: boolean
  eraserUsed: boolean
  questionOrder: number
}

interface QuestionOption {
  optionId: string
  option: string
  answer: boolean
}

interface UseLastGameStateReturn {
  gameState: GameStatResult | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export const useLastGameState = (): UseLastGameStateReturn => {
  const { data, isLoading, error, refetch } = useMyLastGamePerformance()

  return {
    gameState: (data as unknown as GameStatResult) ?? null,
    loading: isLoading,
    error: error as Error | null,
    refetch,
  }
}
