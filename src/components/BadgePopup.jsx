import Confetti from "react-confetti";
import { useSanta } from "../context/SantaContext";

export default function BadgePopup() {
  const { badgesPop, setBadgesPop } = useSanta();

  if (!badgesPop) return null;

  const badgeTitles = {
    wishlist: "Wishlist Pro 🎖",
    message: "Message Hero 🏆",
    game: "Game Player 🎮",
    roast_sent: "Sharp Tongue 🔥",
    roast_received: "Survivor 💥"
  };

  setTimeout(() => setBadgesPop(null), 3000);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <Confetti numberOfPieces={180} />
      <div className="bg-amber-200 text-amber-900 px-8 py-6 rounded-3xl shadow-xl text-2xl font-bold animate-pop">
        🏅 {badgeTitles[badgesPop]}
      </div>
    </div>
  );
}
