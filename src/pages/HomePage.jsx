import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSanta } from "../context/SantaContext";

export default function HomePage() {
  const { currentUser } = useSanta();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-white">
      {/* Soft gradient blobs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-70" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-70" />

      <div className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            🎄 Secret Santa 2025
          </p>

          <h1
            className="text-5xl md:text-6xl font-bold text-[#b3001b] leading-tight"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Welcome, <br />
            <span className="text-gray-900">
              {currentUser.name}
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-600 max-w-md">
            This is your cozy Christmas hub. Build your wishlist, play games,
            send your secret roast letter, and watch the magic slowly build
            until gift day. ✨
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => navigate("/profile")}
              className="px-5 py-3 rounded-full bg-[#b3001b] text-white text-sm font-semibold shadow-md hover:bg-[#8c0016] hover:-translate-y-0.5 transition"
            >
              Open My Profile 🎁
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="px-5 py-3 rounded-full border border-gray-300 text-sm text-gray-700 bg-white/80 hover:bg-gray-50 hover:-translate-y-0.5 transition"
            >
              Go to Wishlist 💡
            </button>
          </div>
        </motion.div>

        {/* Right: Card / Art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="card-xmas p-6 rounded-3xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs text-gray-500">Tonight’s Mood</p>
              <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-[#b3001b]">
                Secret Santa
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden mb-4 h-44 bg-gray-100 flex items-center justify-center text-5xl">
              🎄
            </div>

            <p className="text-sm text-gray-700 mb-3">
              “Somewhere, your Secret Santa is stalking your wishlist and
              overthinking every detail…”
            </p>

            <p className="text-xs text-gray-500">
              Use your profile page tabs to:
              <br />
              – Add wishlist items
              <br />
              – Play the mini game
              <br />
              – Drop a roast letter
              <br />
              – Collect badges
            </p>

            <div className="mt-4 flex justify-between text-xl">
              <span>🎁</span>
              <span>⛄</span>
              <span>🎄</span>
              <span>🕵️‍♂️</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
