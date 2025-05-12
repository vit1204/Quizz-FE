import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashPage from "./pages/SplashPage/SplashPage";
import QuizzPage from "./pages/QuizzPage/QuizzPage";
import ResultsPage from "./pages/ResultPage/ResultPage";
import ReviewPage from "./pages/ReviewPage/ReviewPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/quizz" element={<QuizzPage />} />

        <Route path="/results" element={<ResultsPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
