import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const GameZoneAPI = {
  getAllGames(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("qm-games", {}, {}, "GET");
  },
  getAGame(gameType: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `qm-games/game?game-type=${gameType}`,
      {},
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
      {},
      "POST"
    );
  },
};

export default GameZoneAPI;
