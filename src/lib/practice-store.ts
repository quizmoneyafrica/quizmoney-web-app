import { useEffect, useState } from "react";
import { useSocket } from "./socket";

export interface PracticeQuestion {
  id: string;
  text: string;
  options: { a: string; b: string; c: string; d: string };
  category: string;
}

export interface PracticeStartData {
  sessionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  message: string;
  // Merged from getPracticeQuestion
  questionIndex: number;
  eraserAvailable: boolean;
  question: PracticeQuestion;
}

export interface PracticeAnswerData {
  questionIndex: number;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  wasAutoCorrected: boolean;
  pointsEarned: number;
  score: number;
  eraserUsed: boolean;
  isFinished: boolean;
  summary?: PracticeSummary;
  nextQuestion?: {
    questionIndex: number;
    totalQuestions: number;
    question: PracticeQuestion;
  };
}

export interface PracticeSummary {
  score: number;
  totalQuestions: number;
  totalAnswered: number;
  correct: number;
  wrong: number;
  autoCorrected: number;
  accuracy: number;
  durationSeconds: number;
  answers: {
    questionNumber: number;
    question: string;
    yourAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    wasAutoCorrected: boolean;
  }[];
}

export interface PracticeSocketResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const usePracticeSocket = () => {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(socket?.connected ?? false);

  useEffect(() => {
    if (!socket) return;
    // Sync initial state
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);
  
  const startPractice = (
    category: string | undefined,
    callback: (res: PracticeSocketResponse<PracticeStartData>) => void,
  ) => {
    if (!socket) return callback({ success: false, message: "Not connected" });
    socket.emit("practice:start", { category }, callback);
  };

  const getQuestion = (
    callback: (res: PracticeSocketResponse<PracticeStartData>) => void,
  ) => {
    if (!socket) return callback({ success: false, message: "Not connected" });
    socket.emit("practice:question", null, callback);
  };

  const submitAnswer = (
    questionIndex: number,
    selectedOption: "a" | "b" | "c" | "d",
    callback: (res: PracticeSocketResponse<PracticeAnswerData>) => void,
  ) => {
    if (!socket) return callback({ success: false, message: "Not connected" });
    socket.emit("practice:answer", { questionIndex, selectedOption }, callback);
  };

  const quitPractice = (
    callback: (
      res: PracticeSocketResponse<{
        message: string;
        summary: PracticeSummary;
      }>,
    ) => void,
  ) => {
    if (!socket) return callback({ success: false, message: "Not connected" });
    socket.emit("practice:quit", null, callback);
  };

  return {
    socket,
    isConnected,
    startPractice,
    getQuestion,
    submitAnswer,
    quitPractice,
  };
};
