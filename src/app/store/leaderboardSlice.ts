/* eslint-disable */
// STUB — leaderboard state moves to React Query hooks in @/lib/queries

export const setSelectedPlayer = (_v: any) => ({ type: 'stub/setSelectedPlayer' })
export const setLeaderboard = (_v: any[]) => ({ type: 'stub/setLeaderboard' })

export default function leaderboardReducer(state = { selectedPlayer: null }, _action: any) {
  return state
}

export const setLastGameLeaderboard = (_v: any) => ({ type: 'stub/setLastGameLeaderboard' })
export const setAllTimeLeaderboard = (_v: any) => ({ type: 'stub/setAllTimeLeaderboard' })
export const clearLeaderboards = () => ({ type: 'stub/clearLeaderboards' })
