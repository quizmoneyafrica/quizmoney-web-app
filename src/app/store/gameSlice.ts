/* eslint-disable */
// STUB — game state moves to Socket.io + local component state

export type CurrentLiveQuestionOptionsObj = { option: string; value: string; [key: string]: any }
export type CurrentLiveQuestion = { question: string; options: CurrentLiveQuestionOptionsObj[]; [key: string]: any }

export const setPhase = (_v: any) => ({ type: 'stub/setPhase' })
export const stopAudio = () => ({ type: 'stub/stopAudio' })
export const playAudio = () => ({ type: 'stub/playAudio' })
export const setCurrentLiveQuestion = (_v: any) => ({ type: 'stub/setCurrentLiveQuestion' })
export const setOptionLocked = (_v: any) => ({ type: 'stub/setOptionLocked' })
export const setShowAdsScreen = (_v: boolean) => ({ type: 'stub/setShowAdsScreen' })
export const updateNextGameData = (_v: any) => ({ type: 'stub/updateNextGameData' })
export const setTopGamers = (_v: any[]) => ({ type: 'stub/setTopGamers' })
export const setNextGameData = (_v: any) => ({ type: 'stub/setNextGameData' })
export const setIsAllowedInGame = (_v: boolean) => ({ type: 'stub/setIsAllowedInGame' })

export default function gameReducer(state = {}, _action: any) {
  return state
}

export const setTotalTimeUsed = (_v: number) => ({ type: 'stub/setTotalTimeUsed' })
export const setOpenLeaveGame = (_v: boolean) => ({ type: 'stub/setOpenLeaveGame' })
export const setshowResultScreen = (_v: any) => ({ type: 'stub/setshowResultScreen' })
export const setShowGameCountdown = (_v: any) => ({ type: 'stub/setShowGameCountdown' })
export const setGameEnded = (_v: any) => ({ type: 'stub/setGameEnded' })
