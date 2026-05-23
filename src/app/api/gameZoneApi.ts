/* eslint-disable */
// STUB — game zone uses Socket.io; HTTP game zone API removed

const GameZoneAPI = {
  getAllGames: async () => ({ success: false, data: [] as any[] }),
  getAGame: async (_gameType: string) => ({ success: false, data: null as any }),
  stakeInGame: async (_gameId: string, _gameType: string, _stake: number) => ({ success: false, data: { sessionId: '', lowerBound: 0, upperBound: 0, range: 0, trials: 0 } }),
  leaveNumberGuessGame: async (_sessionId: string) => ({ success: false, data: null }),
  buyTrialsNumberGuessGame: async (_args: { sessionId: string; quantity: number }) => ({ success: false, code: '', data: null }),
  submitGuess: async (_guess: number, _gameSessionId: string, _timeInMillis: number) => ({ success: false, data: { guessDirection: '', result: '' } }),
}

export default GameZoneAPI
