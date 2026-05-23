/**
 * game-zone-store.ts
 *
 * Zustand store for game zone UI state.
 * Replaces gameZoneSlice (Redux) — identical state shape and action names.
 *
 * Usage:
 *   import { useGameZoneStore } from '@/lib/game-zone-store'
 *
 *   const phase = useGameZoneStore((s) => s.phase)
 *   const setZonePhase = useGameZoneStore((s) => s.setZonePhase)
 */

import { create } from 'zustand'

export type GameTypes = 'NUMBER_GUESSER' | 'MEMORY_GAME' | 'PERFECT_SCORE' | ''
export type GamePhase = 'zone' | 'game' | 'playing' | 'win' | 'lost' | ''

export interface GameZoneGamesObject {
  gameId: string
  name: string
  description: string
  type: GameTypes
  config: {
    minimumStake: number
    maximumStake: number
  }
}

interface GameZoneStore {
  allGamesData: GameZoneGamesObject[]
  currentGameData: GameZoneGamesObject
  audioShouldPlay: boolean
  phase: GamePhase

  // Actions (mirror Redux action names for easy migration)
  setGameZoneGames: (games: GameZoneGamesObject[]) => void
  setCurrentGameData: (game: GameZoneGamesObject) => void
  setZonePhase: (phase: GamePhase) => void
  setCurrentGameType: (type: GameTypes) => void
  playZoneAudio: () => void
  stopZoneAudio: () => void
}

const DEFAULT_GAME_DATA: GameZoneGamesObject = {
  gameId: '',
  name: '',
  description: '',
  type: '',
  config: { minimumStake: 200, maximumStake: 1000000 },
}

export const useGameZoneStore = create<GameZoneStore>((set) => ({
  allGamesData: [],
  currentGameData: DEFAULT_GAME_DATA,
  audioShouldPlay: false,
  phase: '',

  setGameZoneGames: (games) => set({ allGamesData: games }),
  setCurrentGameData: (game) => set({ currentGameData: game }),
  setZonePhase: (phase) => set({ phase }),
  setCurrentGameType: (type) =>
    set((s) => ({
      currentGameData: { ...s.currentGameData, type },
    })),
  playZoneAudio: () => set({ audioShouldPlay: true }),
  stopZoneAudio: () => set({ audioShouldPlay: false }),
}))
