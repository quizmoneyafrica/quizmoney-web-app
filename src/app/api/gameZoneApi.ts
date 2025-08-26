import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const GameZoneAPI = {
  getAllGames(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("qm-games", {}, {}, "GET");
  },
  getAGame(gameType: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "qm-games/play",
      { "game-type": gameType },
      {},
      "GET"
    );
  },

  stakeInGame(
    gameId: string,
    gameType: string,
    customerId: string,
    stake: number
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "qm-games/game",
      {
        gameId,
        gameType,
        customerId,
        stake,
      },
      {},
      "POST"
    );
  },
};

export default GameZoneAPI;
