import { useState, useEffect, useCallback } from "react";
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

  const fetchLastGameState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await LeaderboardAPI.userLastGameStat();
      console.log(
        "=============useLastGameState result stat======================="
      );
      console.log(JSON.stringify(response, null, 2));
      console.log("=============useLastGameState stat=======================");

      if (response.data) {
        setGameState(response.data);
      }
    } catch (err) {
      console.log("==========useLastGameState error==========================");
      console.log(err);
      console.log("==========useLastGameState error==========================");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastGameState();
  }, [fetchLastGameState]);

  return {
    gameState,
    loading,
    error,
    refetch: fetchLastGameState,
  };
};

export interface GameStatResult {
  score: number;
  rank: number;
  firstName: string;
  avatarUrl: string;
  totalAnswerTime: string;
  questionsAnswered: QuestionsAnswered[];
  rewardType: string;
  prizeWon: number;
}

interface QuestionsAnswered {
  questionText: string;
  questionOptions: QuestionOption[];
  customerAnswer: string;
  isCorrect: boolean;
  eraserUsed: boolean;
  questionOrder: number;
}

interface QuestionOption {
  optionId: string;
  option: string;
  answer: boolean;
}
