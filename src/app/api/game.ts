/* eslint-disable */
// STUB — game is Socket.io only; HTTP game API removed

const GameApi = {
  fetchNextGame: async () => ({ success: false, data: null }),
  registerForGame: async (_gameId: string) => ({ success: false, data: null }),
  removeUserFromGame: async (_gameId: string) => ({ success: false, data: null }),
  getCurrentQuestion: async () => ({ success: false, data: { id: '', question: '', options: [] as any[] } }),
  updateErasers: async (_erasersUsed: number) => ({ success: false, data: null }),
  submitAnswer: async (_optionId: any, _timeSpent?: any) => ({ success: false, data: null }),
  recordGameAnswer: async (..._args: any[]) => ({ success: false as const, data: null }),
}

export default GameApi

export const decryptGameData = (_data: any): any => _data
