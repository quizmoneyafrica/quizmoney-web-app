/**
 * live-game-store.ts
 *
 * Zustand store for the live-game session.
 * Replaces the Redux gameSlice stub for all lobby/game-phase state.
 *
 * Phase machine:
 *   idle → joining → lobby → locked → countdown → playing
 *                                   ↘ cancelled
 *                                   ↘ error (join failed)
 *
 * Usage (inside component):
 *   const phase = useLiveGameStore((s) => s.phase)
 *
 * Usage (outside React — socket handlers etc.):
 *   useLiveGameStore.getState().setPhase('playing')
 */

import { create } from 'zustand'

export type LiveGamePhase =
  | 'idle'       // initial; no join attempted yet
  | 'joining'    // socket game:join in flight
  | 'lobby'      // joined, waiting for game to lock
  | 'locked'     // server emitted game:locked, confetti time
  | 'countdown'  // server emitted game:started, 10→0 local countdown
  | 'playing'    // countdown hit 0, questions flowing
  | 'completed'  // game:finished received
  | 'result'     // showing results screen
  | 'cancelled'  // game:cancelled received
  | 'error'      // join failed / page refreshed mid-game

export interface LeaderboardEntry {
  rank: number
  playerId: string
  username: string
  score: number
  totalTimeMs?: number
}

interface LiveGameStore {
  phase: LiveGamePhase
  gameId: string | null
  /** Whether the player owned ≥1 eraser at join time */
  hasEraser: boolean
  /** Whether the player is currently opted-in to eraser use */
  eraserOpted: boolean
  /** Live player count — updated by game:player:joined + game:locked */
  totalPlayers: number
  /** Final leaderboard from game:finished */
  leaderboard: LeaderboardEntry[]
  /**
   * First game:question event buffered by liveGameQueries before GameScreen mounts.
   * GameScreen reads this on mount and clears it — prevents the first question
   * being dropped when the server sends it before the local countdown finishes.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingQuestion: any | null
  /** Error message when phase === 'error' */
  errorMessage: string | null

  // ── Actions ───────────────────────────────────────────────────────────────
  setPhase: (phase: LiveGamePhase) => void
  setJoinResult: (result: {
    gameId: string
    hasEraser: boolean
    eraserOpted: boolean
  }) => void
  setTotalPlayers: (count: number) => void
  setEraserOpted: (opted: boolean) => void
  setLeaderboard: (entries: LeaderboardEntry[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPendingQuestion: (q: any) => void
  clearPendingQuestion: () => void
  setError: (message: string) => void
  reset: () => void
}

const INITIAL: Omit<LiveGameStore, keyof Pick<LiveGameStore,
  | 'setPhase' | 'setJoinResult' | 'setTotalPlayers' | 'setEraserOpted'
  | 'setLeaderboard' | 'setPendingQuestion' | 'clearPendingQuestion'
  | 'setError' | 'reset'
>> = {
  phase: 'idle',
  gameId: null,
  hasEraser: false,
  eraserOpted: false,
  totalPlayers: 0,
  leaderboard: [],
  pendingQuestion: null,
  errorMessage: null,
}

export const useLiveGameStore = create<LiveGameStore>((set) => ({
  ...INITIAL,

  setPhase: (phase) => set({ phase }),

  setJoinResult: ({ gameId, hasEraser, eraserOpted }) =>
    set({ phase: 'lobby', gameId, hasEraser, eraserOpted }),

  setTotalPlayers: (totalPlayers) => set({ totalPlayers }),

  setEraserOpted: (eraserOpted) => set({ eraserOpted }),

  setLeaderboard: (leaderboard) => set({ leaderboard }),

  setPendingQuestion: (pendingQuestion) => set({ pendingQuestion }),

  clearPendingQuestion: () => set({ pendingQuestion: null }),

  setError: (errorMessage) => set({ phase: 'error', errorMessage }),

  reset: () => set(INITIAL as LiveGameStore),
}))
