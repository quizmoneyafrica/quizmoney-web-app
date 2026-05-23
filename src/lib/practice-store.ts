import { create } from "zustand";
import { apiClient } from "@/lib/api-client";
import { Socket } from "socket.io-client";

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  category: string;
}

export interface PracticeAnswerSummary {
  questionIndex: number;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  wasAutoCorrected: boolean;
}

export interface PracticeSessionSummary {
  score: number;
  totalQuestions: number;
  totalAnswered: number;
  correct: number;
  wrong: number;
  autoCorrected: number;
  accuracy: number;
  durationSeconds: number;
  answers: PracticeAnswerSummary[];
}

interface PracticeStore {
  isActive: boolean;
  isFinished: boolean;
  sessionId: string | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  message: string;
  eraserUsed: boolean;
  currentQuestion: Question | null;
  summary: PracticeSessionSummary | null;
  loading: boolean;
  error: string | null;

  // Utility Actions
  reset: () => void;
  setError: (error: string | null) => void;

  // ─── HTTP REST Actions ───
  startSessionHttp: (category?: string) => Promise<void>;
  fetchQuestionHttp: () => Promise<void>;
  submitAnswerHttp: (
    questionIndex: number,
    selectedOption: "a" | "b" | "c" | "d",
  ) => Promise<void>;
  quitSessionHttp: () => Promise<void>;

  // ─── Socket.io Live Bindings ───
  bindSocketSession: (socket: Socket, category?: string) => void;
}

const initialState = {
  isActive: false,
  isFinished: false,
  sessionId: null,
  currentQuestionIndex: 0,
  totalQuestions: 10,
  score: 0,
  message: "",
  eraserUsed: false,
  currentQuestion: null,
  summary: null,
  loading: false,
  error: null,
};

export const usePracticeStore = create<PracticeStore>((set, get) => ({
  ...initialState,

  reset: () => set(initialState),
  setError: (error) => set({ error }),

  // ─── OPTION A: HTTP REST METHODS (practice.routes.ts) ───
  startSessionHttp: async (category) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.post("/api/practice/start", { category });
      if (res.data.success) {
        const {
          sessionId,
          currentQuestionIndex,
          totalQuestions,
          score,
          message,
        } = res.data.data;
        set({
          isActive: true,
          isFinished: false,
          sessionId,
          currentQuestionIndex,
          totalQuestions,
          score,
          message,
        });
        // Fetch the first question instantly
        await get().fetchQuestionHttp();
      }
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to start practice session",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchQuestionHttp: async () => {
    try {
      const res = await apiClient.get("/api/practice/question");
      if (res.data.success) {
        const { eraserAvailable, question, questionIndex, score } =
          res.data.data;
        set({
          currentQuestionIndex: questionIndex,
          score,
          eraserUsed: !eraserAvailable,
          currentQuestion: {
            id: question.id,
            question_text: question.text,
            option_a: question.options.a,
            option_b: question.options.b,
            option_c: question.options.c,
            option_d: question.options.d,
            category: question.category,
          },
        });
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to get next question",
      });
    }
  },

  submitAnswerHttp: async (questionIndex, selectedOption) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.post("/api/practice/answer", {
        question_index: questionIndex,
        selected_option: selectedOption,
      });
      if (res.data.success) {
        const data = res.data.data;
        set({
          score: data.score,
          eraserUsed: data.eraserUsed,
          isFinished: data.isFinished,
        });

        if (data.isFinished) {
          set({
            summary: data.summary,
            isActive: false,
            currentQuestion: null,
          });
        } else if (data.nextQuestion) {
          const next = data.nextQuestion;
          set({
            currentQuestionIndex: next.questionIndex,
            currentQuestion: next.question,
          });
        }
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to submit answer" });
    } finally {
      set({ loading: false });
    }
  },

  quitSessionHttp: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.post("/api/practice/quit");
      if (res.data.success) {
        set({
          summary: res.data.data.summary,
          isFinished: true,
          isActive: false,
          currentQuestion: null,
        });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to quit session" });
    } finally {
      set({ loading: false });
    }
  },

  // ─── OPTION B: SOCKET.IO METHODS (practice.handler.ts) ───
  bindSocketSession: (socket, category) => {
    set({ loading: true, error: null });

    // Emit standard initiation payload
    socket.emit("practice:start", { category }, (response: any) => {
      if (response.success) {
        const {
          sessionId,
          currentQuestionIndex,
          totalQuestions,
          score,
          eraserAvailable,
          question,
        } = response.data;
        set({
          isActive: true,
          isFinished: false,
          sessionId,
          currentQuestionIndex,
          totalQuestions,
          score,
          eraserUsed: !eraserAvailable,
          currentQuestion: question,
          loading: false,
        });
      } else {
        set({ error: response.message, loading: false });
      }
    });

    // Override actions to use the existing Socket connection instead of REST
    get().submitAnswerHttp = async (questionIndex, selectedOption) => {
      set({ loading: true, error: null });
      socket.emit(
        "practice:answer",
        { questionIndex, selectedOption },
        (res: any) => {
          if (res.success) {
            set({
              score: res.data.score,
              eraserUsed: res.data.eraserUsed,
              isFinished: res.data.isFinished,
            });

            if (res.data.isFinished) {
              set({
                summary: res.data.summary,
                isActive: false,
                currentQuestion: null,
              });
            } else if (res.data.nextQuestion) {
              set({
                currentQuestionIndex: res.data.nextQuestion.questionIndex,
                currentQuestion: res.data.nextQuestion.question,
              });
            }
          } else {
            set({ error: res.message });
          }
          set({ loading: false });
        },
      );
    };

    get().quitSessionHttp = async () => {
      set({ loading: true });
      socket.emit("practice:quit", {}, (res: any) => {
        if (res.success) {
          set({
            summary: res.data.summary,
            isFinished: true,
            isActive: false,
            currentQuestion: null,
          });
        } else {
          set({ error: res.message });
        }
        set({ loading: false });
      });
    };
  },
}));
