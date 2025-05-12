export interface QuizQuestion {
  answer: string;
  id: number;
  text: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export interface submitAnswer {
  sessionId: number;
  questionId: number;
  userAnswer: string;
}

export interface results {
  totalCorrect: number;
  totalTime: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
}
