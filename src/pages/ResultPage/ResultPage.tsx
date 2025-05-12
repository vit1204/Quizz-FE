"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizzStore";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { results } = useQuizStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading or check if results are available
    if (results) {
      setLoading(false);
    } else {
      // If no results, maybe redirect to home
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results]);

  const handlePlayAgain = () => {
    navigate("/"); // Assuming the quiz starts at the home route
  };
  const handleReview = () => {
    navigate("/review");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-[#1e2756] text-white">
        <div className="text-xl">Loading results...</div>
      </div>
    );
  }

  const isPassed = results && results.totalCorrect >= 5;
  const totalQuestions = 10; // Assuming 10 questions total

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#1e2756]">
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        {isPassed ? (
          <>
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Congratulations!!
            </h1>
            <p className="text-gray-600 mb-1">You are amazing!!</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Better Luck Next Time!
            </h1>
            <p className="text-gray-600 mb-1">Keep practicing!</p>
          </>
        )}

        <p className="text-lg text-gray-700 mb-6">
          {results?.totalCorrect}/{totalQuestions} correct answers in{" "}
          {results?.totalTime}
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handlePlayAgain}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={handleReview}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Review Answers
          </button>
        </div>
      </div>
    </div>
  );
}
