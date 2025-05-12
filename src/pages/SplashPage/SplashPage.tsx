import { useNavigate } from "react-router-dom";
import Logo from "../../assets/losdac.png";

function SplashPage() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <img src={Logo} height={100} width={100} alt="" />
      <div>
        <button
          onClick={() => navigate("/quizz")}
          className="bg-blue-500  cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Quizz
        </button>
      </div>
    </div>
  );
}

export default SplashPage;
