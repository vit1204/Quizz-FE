"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizzStore";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController, // Add DoughnutController
} from "chart.js";
import { getQuizReview } from "../../api/quizz";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

interface QuizReviewItem {
  questionId: number;
  questionText: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  userAnswer: string;
  correctAnswer: string;
  isCorrect: number;
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { sessionId } = useQuizStore();
  const [reviewData, setReviewData] = useState<QuizReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    fetchReviewData();

    return () => {
      // Cleanup chart on unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [sessionId, navigate]);

  const fetchReviewData = async () => {
    try {
      const response = await getQuizReview(sessionId);
      setReviewData(response);
      setLoading(false);
      createChart(response);
    } catch (error) {
      console.error("Error fetching review data:", error);
      setLoading(false);
    }
  };

  const createChart = (data: QuizReviewItem[]) => {
    if (!chartRef.current || !data.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Calculate correct/incorrect counts
    const correctCount = data.filter((item) => item.isCorrect === 1).length;
    const incorrectCount = data.length - correctCount;

    // Configure chart
    chartInstance.current = new ChartJS(ctx, {
      type: "doughnut",
      data: {
        labels: ["Correct", "Incorrect"],
        datasets: [
          {
            data: [correctCount, incorrectCount],
            backgroundColor: ["#10b981", "#ef4444"],
            borderColor: ["#059669", "#dc2626"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.raw as number;
                const total = context.dataset.data.reduce(
                  (a, b) => a + b,
                  0
                ) as number;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        cutout: "70%",
      },
    });
  };

  const handlePlayAgain = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-[#1e2756] text-white">
        <div className="text-xl">Loading review data...</div>
      </div>
    );
  }

  const correctCount = reviewData.filter((item) => item.isCorrect === 1).length;
  const totalQuestions = reviewData.length;
  const scorePercentage = totalQuestions
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-[100dvh] bg-[#1e2756] py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h1 className="text-2xl font-bold">Quiz Review</h1>
          <p className="text-blue-100">
            You scored {correctCount}/{totalQuestions} ({scorePercentage}%)
          </p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Summary
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-64 h-64">
                <canvas ref={chartRef} />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Correct: {correctCount} questions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">
                    Incorrect: {totalQuestions - correctCount} questions
                  </span>
                </div>
                <div className="mt-2 p-3 bg-gray-100 rounded-md">
                  <p className="text-gray-700">
                    Total time: {reviewData.length > 0 ? "299 seconds" : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Question Review
          </h2>
          <div className="space-y-6">
            {reviewData.map((item, index) => (
              <div
                key={item.questionId}
                className={`p-4 rounded-lg border ${
                  item.isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-800">
                    {index + 1}. {item.questionText}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      item.isCorrect
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {item.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(item.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-2 rounded-md border ${
                        value === item.correctAnswer
                          ? "bg-green-100 border-green-300"
                          : value === item.userAnswer && !item.isCorrect
                          ? "bg-red-100 border-red-300"
                          : "bg-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-2">
                          {key.toUpperCase()}
                        </span>
                        <span className="text-gray-800">{value}</span>
                        {value === item.userAnswer && (
                          <span className="ml-auto text-sm font-medium">
                            Your answer
                          </span>
                        )}
                        {value === item.correctAnswer &&
                          value !== item.userAnswer && (
                            <span className="ml-auto text-sm font-medium text-green-600">
                              Correct answer
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePlayAgain}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
