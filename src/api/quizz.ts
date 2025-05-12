import { $get, $post } from "./axios/index";
import type { submitAnswer } from "../types/quiz";

// export function startQuiz() {
//   return $post("/start-quizz");
// }

export function submitAnswer(data: submitAnswer) {
  return $post("/submit-answer", data);
}

export function getQuizResults(sessionId: number) {
  return $get(`/results/${sessionId}`);
}

// Get review data for completed quiz
export function getQuizReview(sessionId: number) {
  return $get(`/review/${sessionId}`);
}
