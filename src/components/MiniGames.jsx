import { useSanta } from "../context/SantaContext";
import { useState, useEffect } from "react";

export default function MiniGames() {
  const { currentUser, members } = useSanta();
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("game_answers");
    return saved ? JSON.parse(saved) : {};
  });

  const [coffee, setCoffee] = useState("");
  const [trip, setTrip] = useState("");
  const [ignore, setIgnore] = useState("");

  useEffect(() => {
    localStorage.setItem("game_answers", JSON.stringify(answers));
  }, [answers]);

  const submit = () => {
    const updated = {
      ...answers,
      [currentUser.id]: {
        coffee,
        trip,
        ignore,
      },
    };
    setAnswers(updated);
  };

  const allVotes = Object.values(answers);

  const countVotes = (type, name) =>
    allVotes.filter((v) => v[type] === name).length;

  return (
    <div className="space-y-6">

      <h2 className="text-lg font-semibold text-center text-rose-500">
        🎮 Mini Game — Pick a Person 🎁
      </h2>

      {/* Selector boxes */}
      <div className="space-y-4">
        {/* Coffee */}
        <div>
          <label className="text-xs text-gray-600 ml-1">☕ Coffee With</label>
          <select
            className="w-full border p-2 rounded-xl bg-pink-50 border-pink-200"
            value={coffee}
            onChange={(e) => setCoffee(e.target.value)}
          >
            <option value="">Select</option>
            {members.map((m) =>
              !m.isAdmin ? <option key={m.id}>{m.name}</option> : null
            )}
          </select>
        </div>

        {/* Trip */}
        <div>
          <label className="text-xs text-gray-600 ml-1">🚗 Road Trip With</label>
          <select
            className="w-full border p-2 rounded-xl bg-pink-50 border-pink-200"
            value={trip}
            onChange={(e) => setTrip(e.target.value)}
          >
            <option value="">Select</option>
            {members.map((m) =>
              !m.isAdmin ? <option key={m.id}>{m.name}</option> : null
            )}
          </select>
        </div>

        {/* Ignore */}
        <div>
          <label className="text-xs text-gray-600 ml-1">🙈 Ignore Text Of</label>
          <select
            className="w-full border p-2 rounded-xl bg-pink-50 border-pink-200"
            value={ignore}
            onChange={(e) => setIgnore(e.target.value)}
          >
            <option value="">Select</option>
            {members.map((m) =>
              !m.isAdmin ? <option key={m.id}>{m.name}</option> : null
            )}
          </select>
        </div>

        <button
          onClick={submit}
          className="w-full py-2 bg-pink-500 text-white rounded-xl shadow hover:bg-pink-600"
        >
          Submit 🎀
        </button>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-center">Live Results 🔐</h3>
        {members.map((m) =>
          !m.isAdmin ? (
            <div
              key={m.id}
              className="bg-white p-3 border border-pink-100 rounded-xl text-sm flex justify-between"
            >
              <span className="text-gray-600">{m.name}</span>
              <span className="text-pink-500">
                ☕ {countVotes("coffee", m.name)} · 🚗 {countVotes("trip", m.name)} · 🙈{" "}
                {countVotes("ignore", m.name)}
              </span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
