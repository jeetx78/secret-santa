// src/pages/Home.jsx
import { useSanta } from "../context/SantaContext";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

export default function Home() {
  const { currentUser, badges } = useSanta();
  const navigate = useNavigate();

  if (!currentUser)
    return <p className="text-center mt-10 text-gray-600">Please log in</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 text-center relative overflow-hidden">

      {/* Confetti animation */}
      <Confetti numberOfPieces={120} recycle={false} />

      {/* Welcome Header */}
      <h1 className="text-5xl font-bold text-blue-900 mt-10">
        🎄 Welcome, {currentUser.name}! 🎄
      </h1>

      <p className="text-gray-700 mt-3 text-lg">
        You are officially inside the Secret Santa Wonderland ✨
      </p>

      {/* Avatar */}
      <div className="w-44 h-44 rounded-full overflow-hidden mx-auto mt-8 border-4 border-blue-300 shadow-xl cursor-pointer hover:scale-105 transition-transform">
        <img
          src={currentUser.avatar}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Badge Section */}
      <h2 className="text-3xl font-semibold text-blue-800 mt-10">
        🏅 Your Earned Badges
      </h2>

      {!badges || badges.length === 0 ? (
        <p className="text-gray-600 mt-4">
          No badges yet — start exploring to earn some! 🎯
        </p>
      ) : (
        <div className="flex gap-4 flex-wrap justify-center mt-6">
          {badges.map((b, i) => (
            <div
              key={i}
              className="px-5 py-3 bg-white rounded-xl shadow border border-blue-200 text-blue-800 font-bold"
            >
              {b.emoji} {b.title}
            </div>
          ))}
        </div>
      )}

      {/* Go to Profile Button */}
      <button
        onClick={() => navigate("/profile")}
        className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xl shadow-md transition transform hover:-translate-y-1"
      >
        Enter My Profile 🎁
      </button>
    </div>
  );
}
