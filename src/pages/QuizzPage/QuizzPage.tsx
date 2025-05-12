"use client";

import { useEffect, useState } from "react";
import QuestionList from "../../components/UI/QuestionList";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizzStore";
import { submitAnswer, getQuizResults } from "../../api/quizz";

function QuizzPage() {
  const { questions, sessionId, isLoading, fetchQuestions, setResults } =
    useQuizStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{
    [key: number]: { key: string; value: string };
  }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = async (answerKey: string) => {
    if (!sessionId) {
      console.error("Session ID is missing");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    // Get the answer value (text) from the options using the key
    const answerValue =
      currentQuestion.options[
        answerKey as keyof typeof currentQuestion.options
      ];

    // Save both key and value to state
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        key: answerKey,
        value: answerValue,
      },
    }));
    setIsAnswered(true);

    try {
      console.log("Submitting answer value:", answerValue);
      console.log("Session ID:", sessionId);
      console.log("Question ID:", currentQuestion.id);

      // Submit the VALUE (text) to the API, not the key
      const response = await submitAnswer({
        sessionId,
        questionId: currentQuestion.id,
        userAnswer: answerValue,
      });

      console.log("API response:", response);
      if (response) {
        setIsCorrect(response.isCorrect);

        // If the answer is incorrect and the API returns the correct answer
        if (!response.isCorrect && response.correctAnswer) {
          // Store the correct answer
          setCorrectAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: response.correctAnswer,
          }));
          console.log("Stored correct answer:", response.correctAnswer);
        }

        console.log("Answer submitted successfully");
      } else {
        console.error("Error submitting answer:", response);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsCorrect(false); // Assume incorrect if API fails
    }
  };

  const goToNextQuestion = () => {
    setIsAnswered(false);
    setIsCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!sessionId) {
      console.error("Session ID is missing");
      navigate("/results");
      return;
    }

    try {
      const response = await getQuizResults(sessionId);
      setResults(response.results);
      navigate("/results");
    } catch (error) {
      console.error("Error getting quiz results:", error);

      navigate("/results");
    }
  };

  if (isLoading || questions.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswer = correctAnswers[currentQuestion.id];

  return (
    <div className="quiz-page">
      <QuestionList
        question={currentQuestion}
        onSelectAnswer={handleAnswer}
        onNext={goToNextQuestion}
        currentQuestionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        userAnswer={answers[currentQuestion.id]}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        correctAnswer={correctAnswer} // Pass the correct answer to the component
      />
    </div>
  );
}

export default QuizzPage;
