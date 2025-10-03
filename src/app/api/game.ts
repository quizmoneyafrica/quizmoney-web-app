import { ApiResponse } from "./interface";
import CryptoJS from "crypto-js";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const GameApi = {
  fetchNextGame(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("games", {}, "GET");
  },

  registerForGame(gameId: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("games/join", { gameId }, "POST");
  },
  removeUserFromGame(gameId: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("games/leave", { gameId }, "POST");
  },
  getCurrentQuestion(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "games/questions/current",
      {},
      "GET"
    );
  },
  submitAnswer(
    questionOptionId: string,
    answerTimeInMillisecond: number
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "games/questions/submit",
      { questionOptionId, answerTimeInMillisecond },
      "POST"
    );
  },

  updateErasers(erasersUsed: number): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("updateErasers", { erasersUsed });
  },
  recordGameAnswer(
    gameId: string,
    questionNumber: string,
    answer: string,
    totalTime?: string,
    usedEraser?: boolean
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("recordGameAnswer", {
      gameId,
      questionNumber,
      answer,
      ...(totalTime && { totalTime }),
      usedEraser,
    });
  },
};

export default GameApi;

export function decryptGameData(encrypted: string) {
  const bytes = CryptoJS.AES.decrypt(
    encrypted,
    process.env.NEXT_PUBLIC_SECRET_KEY!
  );
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
export function encryptGameData(data: object): string {
  const stringified = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(
    stringified,
    process.env.NEXT_PUBLIC_SECRET_KEY!
  ).toString();
  return encrypted;
}
