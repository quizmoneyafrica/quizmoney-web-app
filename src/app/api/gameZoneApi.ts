import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const GameZoneAPI = {
  getAllGames(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("qm-games", {}, "GET");
  },
  getAGame(gameType: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `qm-games/game?game-type=${gameType}`,
      {},

      "GET"
    );
  },

  stakeInGame(
    gameId: string,
    gameType: string,
    stake: number
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "qm-games/play",
      {
        gameId,
        gameType,
        stake,
      },

      "POST"
    );
  },

  // number guesser
  leaveNumberGuessGame(sessionId: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "number-guesser/leave",
      {
        sessionId,
      },
      "POST"
    );
  },
  buyTrialsNumberGuessGame({sessionId, quantity}: {
  sessionId:string;
  quantity: number;
}): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "number-guesser/trial/purchase",
      {
        sessionId,
        quantity,
      },
      "POST"
    );
  },
  submitGuess(
    guess: number,
    gameSessionId: string,
    timeInMillis: number
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "number-guesser/guess",
      {
        guess,
        gameSessionId,
        timeInMillis,
      },
      "POST"
    );
  },
};

export default GameZoneAPI;
