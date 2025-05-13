"use client";

import type { QuizQuestion } from "../../types/quiz";

interface QuizScreenProps {
  question: QuizQuestion;
  currentQuestionNumber: number;
  totalQuestions: number;
  userAnswer: { key: string; value: string } | null;
  onSelectAnswer: (key: string) => void;
  onNext: () => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswer?: string;
}

export default function QuestionList({
  question,
  currentQuestionNumber,
  totalQuestions,
  userAnswer,
  onSelectAnswer,
  onNext,
  isAnswered,
  isCorrect,
  correctAnswer,
}: QuizScreenProps) {
  const correctAnswerKey = correctAnswer
    ? Object.entries(question.options).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value === correctAnswer
      )?.[0]
    : null;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[100dvh] bg-[#1e2756]">
      <div className="w-full max-w-md p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">
            Question {currentQuestionNumber}/{totalQuestions}
          </h2>
        </div>

        <div className="mb-8">
          <p className="text-xl font-medium">{question.text}</p>
        </div>

        <div className="space-y-4 flex-grow">
          {Object.entries(question.options).map(([key, value]) => {
            let buttonClass = "border-white/30 text-white hover:bg-white/10";
            let borderClass = "border-white/30";

            if (isAnswered) {
              // User's selected answer
              if (userAnswer && userAnswer.key === key) {
                if (isCorrect === true) {
                  // Correct answer
                  buttonClass = "bg-green-600 border-green-600 text-white";
                  borderClass = "border-green-600";
                } else if (isCorrect === false) {
                  // Incorrect answer
                  buttonClass = "bg-red-600 border-red-600 text-white";
                  borderClass = "border-red-600";
                }
              }
              // Show the correct answer when user answered incorrectly
              else if (isCorrect === false && correctAnswerKey === key) {
                buttonClass = "bg-green-600 border-green-600 text-white";
                borderClass = "border-green-600";
              }
            }

            return (
              <button
                key={key}
                onClick={() => onSelectAnswer(key)}
                className={`w-full py-3 px-6 rounded-full border flex items-center justify-between transition-colors ${buttonClass}`}
                type="button"
                disabled={isAnswered}
              >
                <span>{value}</span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${borderClass}`}
                >
                  {isAnswered && (
                    <>
                      {/* Show dot for user's answer */}
                      {userAnswer && userAnswer.key === key && (
                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                      )}
                      {isCorrect === false &&
                        correctAnswerKey === key &&
                        userAnswer?.key !== key && (
                          <span className="text-white text-xs">✓</span>
                        )}
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Show explanation when user answered incorrectly */}
        {isAnswered && isCorrect === false && correctAnswer && (
          <div className="mt-4 p-3 bg-green-600/20 rounded-md border border-green-600/30">
            <p className="text-sm font-medium text-green-400">
              Correct Answer:
            </p>
            <p className="text-white">{correctAnswer}</p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={onNext}
            disabled={!isAnswered}
            className={`w-full py-4 rounded-md font-medium transition-colors ${
              isAnswered
                ? "bg-[#17c526] hover:bg-[#4b5563] text-white"
                : "bg-[#9ca3af] text-white cursor-not-allowed opacity-70"
            }`}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
