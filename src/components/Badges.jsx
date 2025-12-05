import { useSanta } from "../context/SantaContext";
import Confetti from "react-confetti";

export default function Badges() {
  const { currentUser } = useSanta();
  const { badges } = currentUser || {};
  const unlocked = badges || [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-center text-amber-600">
        🏅 Achievement Badges
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: "wishlist", title: "Wishlist Pro", icon: "🎖" },
          { id: "message", title: "Message Hero", icon: "🏆" },
          { id: "game", title: "Game Player", icon: "🎮" },
          { id: "roast_sent", title: "Sharp Tongue", icon: "🔥" },
          { id: "roast_received", title: "Survivor", icon: "💥" },
        ].map((b) => (
          <div
            key={b.id}
            className={`p-4 rounded-2xl border text-center shadow ${
              unlocked?.includes(b.id)
                ? "bg-amber-200 border-amber-400 text-amber-900 badge-unlocked"
                : "bg-gray-100 border-gray-300 text-gray-400"
            }`}
          >
            <div className="text-3xl mb-1">{b.icon}</div>
            <p className="text-sm font-semibold">{b.title}</p>
          </div>
        ))}
      </div>

      {unlocked?.includes("wishlist") && <Confetti numberOfPieces={120} />}
    </div>
  );
}
