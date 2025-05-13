import type { QuizQuestion, results } from "../types/quiz";
import { create } from "zustand";
import { startQuiz } from "../api/quizz";
interface QuizState {
  questions: QuizQuestion[];
  sessionId: number;
  isLoading: boolean;
  results: results | null;
  setResults: (results: results | null) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setSessionId: (sessionId: number) => void;
  fetchQuestions: () => Promise<void>;
}

export const useQuizStore = create<QuizState>((set) => ({
  sessionId: 0,
  results: null,
  setResults: (results) => set({ results }),
  questions: [],
  isLoading: false,
  setQuestions: (questions) => set({ questions, isLoading: false }),
  setSessionId: (sessionId) => set({ sessionId }),
  fetchQuestions: async () => {
    set({ isLoading: true });
    try {
      const response = await startQuiz();
      set({
        questions: response.data.questions,
        sessionId: response.data.sessionId,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching questions:", error);
      set({ isLoading: false });
    }
  },
}));
