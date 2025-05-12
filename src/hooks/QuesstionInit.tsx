// import { startQuiz } from "../api/quizz";
// import { useQuizStore } from "../store/quizzStore";

// export const useQuestionInit = () => {
//   const setQuestions = useQuizStore((state) => state.setQuestions);

//   const initQuestions = async () => {
//     try {
//       const response = await startQuiz();
//       if (response.data) {
//         setQuestions(response.data);
//       }
//     } catch (error) {
//       console.error("Error initializing questions:", error);
//     }
//   };

//   return { initQuestions };
// };
