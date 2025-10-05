import { useState, useEffect } from "react";
import LeaderboardAPI from "../api/leaderboardApi";

interface UseLastGameStateReturn {
  gameState: GameStatResult | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useLastGameState = (): UseLastGameStateReturn => {
  const [gameState, setGameState] = useState<GameStatResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLastGameState = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user games
      const games = await LeaderboardAPI.getUserGames();
      const { gameId } = games?.data || {};

      if (!gameId) {
        console.log("====================================");
        console.log("no game id");
        console.log("====================================");
      }

      const response = await LeaderboardAPI.userLastGameStat(gameId);
      console.log(
        "=============useLastGameState result stat======================="
      );
      console.log(JSON.stringify(response, null, 2));
      console.log("=============useLastGameState stat=======================");

      if (response.data) {
        setGameState(response.data);
      }
    } catch (err) {
      setError(error);
      console.log("==========useLastGameState error==========================");
      console.log(error);
      console.log("==========useLastGameState error==========================");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastGameState();
  }, []);

  return {
    gameState,
    loading,
    error,
    refetch: fetchLastGameState,
  };
};
export type GameStatResult = {
  gameId: string;
  score: number;
  rank: number;
  firstName: string;
  avatarUrl: string;
  questionsAnswered: {
    questionText: string;
    questionOptions: {
      optionId: string;
      option: string;
      answer: boolean;
    }[];
    customerAnswer: string;
    isCorrect: boolean;
    eraserUsed: boolean;
  }[];
};
