/* eslint-disable */
// STUB — game zone state moves to useGameZoneStore from @/lib/game-zone-store (Zustand)

export type GameTypes = 'NUMBER_GUESSER' | 'MEMORY_GAME' | 'PERFECT_SCORE' | ''
export type GamePhase = 'zone' | 'game' | 'playing' | 'win' | 'lost' | ''

export interface GameZoneGamesObject {
  gameId: string
  name: string
  description: string
  type: GameTypes
  config: { minimumStake: number; maximumStake: number }
}

export interface GameZoneGames {
  allGamesData: GameZoneGamesObject[]
  currentGameData: GameZoneGamesObject
  audioShouldPlay: boolean
  phase: GamePhase
}

export const setGameZoneGames = (_v: GameZoneGamesObject[]) => ({ type: 'stub/setGameZoneGames' })
export const setCurrentGameData = (_v: GameZoneGamesObject) => ({ type: 'stub/setCurrentGameData' })
export const setZonePhase = (_v: GamePhase) => ({ type: 'stub/setZonePhase' })
export const setCurrentGameType = (_v: GameTypes) => ({ type: 'stub/setCurrentGameType' })
export const playZoneAudio = () => ({ type: 'stub/playZoneAudio' })
export const stopZoneAudio = () => ({ type: 'stub/stopZoneAudio' })

export default function gameZoneReducer(state = {}, _action: any) {
  return state
}
