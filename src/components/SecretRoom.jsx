import { useState } from "react";
import { useSanta } from "../context/SantaContext";

export default function SecretRoom() {
  const { currentUser, members, roasts, sendRoast } = useSanta();
  const [text, setText] = useState("");

  // Get assigned Santa & Roast target
  const receiver = members.find((m) => m.id === currentUser?.santaFor);
  const roastTarget = members.find((m) => m.id === currentUser?.roastTarget);

  // Messages where user is sender or receiver
  const sentRoasts = roasts.filter((r) => r.fromId === currentUser?.id);
  const receivedRoasts = roasts.filter(
    (r) => r.toId === currentUser?.id && r.released
  );

  const handleSend = () => {
    if (!text.trim()) return;
    sendRoast(currentUser.id, roastTarget.id, text);
    setText("");
  };

  return (
    <div className="space-y-6">
      {/* SECRET INFO */}
      <div className="text-center">
        {currentUser.isAdmin ? (
          <>
            <p className="text-sm text-gray-600">
              🎁 Santa For: <strong>{receiver?.name}</strong>
            </p>
            <p className="text-sm text-gray-600">
              🔥 Roast Target: <strong>{roastTarget?.name}</strong>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              🎁 Santa For: <strong>Hidden 🤫</strong>
            </p>
            <p className="text-sm text-gray-600">
              🔥 Roast Target: <strong>Hidden 🤫</strong>
            </p>
          </>
        )}
      </div>

      {/* SEND ROAST MESSAGE */}
      <div className="space-y-2">
        <textarea
          className="w-full border rounded-xl px-4 py-2 bg-pink-50 border-pink-200 outline-none text-sm"
          placeholder="Write a roast letter 🔥 (Anonymous)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="w-full py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
        >
          Send Roast 💌
        </button>
      </div>

      {/* SENT ROASTS */}
      {sentRoasts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm text-gray-600 font-semibold">
            Your Sent Letters ✍️
          </h3>
          {sentRoasts.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-white rounded-xl border border-pink-100 text-sm shadow"
            >
              <p>{r.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {r.released ? "Delivered 🎉" : "Locked 🔒"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* RECEIVED ROASTS */}
      {receivedRoasts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm text-gray-600 font-semibold">
            Your Received Letters 🎁
          </h3>
          {receivedRoasts.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-red-50 rounded-xl border border-red-200 text-sm shadow"
            >
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hidden */}
      {!currentUser.isAdmin && receivedRoasts.length === 0 && (
        <p className="text-center text-xs text-gray-500">
          📦 Your roast will unlock when Admin releases it…
        </p>
      )}
    </div>
  );
}
