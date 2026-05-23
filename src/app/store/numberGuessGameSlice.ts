/* eslint-disable */
// STUB — number guess game state moves to Socket.io + local component state

export const setGameStatus = (_v: any) => ({ type: 'stub/setGameStatus' })
export const setGameSettings = (_v: any) => ({ type: 'stub/setGameSettings' })
export const setTrials = (_v: any) => ({ type: 'stub/setTrials' })
export const decrementTrials = () => ({ type: 'stub/decrementTrials' })
export const resetTrials = (_v?: any) => ({ type: 'stub/resetTrials' })
export const setExtraTrialBought = (_v: any) => ({ type: 'stub/setExtraTrialBought' })
export const setOpenBuyModal = (_v: boolean) => ({ type: 'stub/setOpenBuyModal' })

export default function numberGuessReducer(state = {}, _action: any) {
  return state
}
