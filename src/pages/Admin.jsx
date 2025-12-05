// src/pages/Admin.jsx
import { useSanta } from "../context/SantaContext";

export default function Admin() {
  const {
    currentUser,
    members,
    allWishlists,
    allRoasts,
    allAnswers,
  } = useSanta();

  if (!currentUser || !currentUser.is_admin) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Access denied ❌
      </p>
    );
  }

  const questions = [
    { id: "coffee", label: "☕ Coffee with whom?" },
    { id: "roadtrip", label: "🚗 Road trip partner?" },
    { id: "ignore", label: "📵 Whose text to ignore?" },
    { id: "trust", label: "🤝 Most trusted?" },
    { id: "time", label: "⏳ Spend more time with?" },
    { id: "crime", label: "🕵️ Partner in crime?" },
    { id: "admire", label: "❤️ Admire the most?" },
    { id: "fun", label: "🎉 Most fun person?" },
  ];

  const nonAdminMembers = members.filter((m) => !m.is_admin);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-blue-100 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
        🎅 Admin Control Room
      </h1>

      {/* USERS & PASSWORDS */}
      <section className="bg-blue-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-blue-800 mb-3">
          👥 All Users & Credentials
        </h2>
        <div className="space-y-1 text-sm text-blue-900">
          {members.map((u) => (
            <p key={u.id}>
              <strong>
                {u.display_name || u.name || u.id}
              </strong>{" "}
              ({u.id}) — Access:{" "}
              <code className="bg-white px-1 rounded">
                {u.access_code}
              </code>{" "}
              | Password:{" "}
              <code className="bg-white px-1 rounded">
                {u.password || "(not set)"}
              </code>{" "}
              {u.is_admin && (
                <span className="ml-2 text-xs text-red-600">
                  [ADMIN]
                </span>
              )}
            </p>
          ))}
        </div>
      </section>

      {/* ASSIGNMENTS */}
      <section className="bg-blue-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-blue-800 mb-3">
          🎁 Secret Santa & Roast Assignments
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-900">
          <div>
            <h3 className="font-bold mb-2">Santa Targets</h3>
            {nonAdminMembers.map((m) => {
              const target = members.find(
                (x) => x.id === m.santa_for
              );
              return (
                <p key={m.id}>
                  <strong>{m.display_name || m.id}</strong> →{" "}
                  {target
                    ? target.display_name || target.id
                    : "Not set"}
                </p>
              );
            })}
          </div>
          <div>
            <h3 className="font-bold mb-2">Roast Targets</h3>
            {nonAdminMembers.map((m) => {
              const target = members.find(
                (x) => x.id === m.roast_target
              );
              return (
                <p key={m.id}>
                  <strong>{m.display_name || m.id}</strong> →{" "}
                  {target
                    ? target.display_name || target.id
                    : "Not set"}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROASTS */}
      <section className="bg-red-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-red-700 mb-3">
          🔥 Roast Letters
        </h2>
        {allRoasts.length === 0 ? (
          <p className="text-sm text-red-700">
            No roasts written yet.
          </p>
        ) : (
          <div className="space-y-2 text-sm text-red-900">
            {allRoasts.map((r) => {
              const from = members.find((m) => m.id === r.from_id);
              const to = members.find((m) => m.id === r.to_id);
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-3 shadow-sm"
                >
                  <p className="mb-1">
                    <strong>
                      {from?.display_name || from?.id || "?"}
                    </strong>{" "}
                    →{" "}
                    <strong>
                      {to?.display_name || to?.id || "?"}
                    </strong>
                  </p>
                  <p className="text-xs whitespace-pre-wrap">
                    {r.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CONNECTION ANSWERS */}
      <section className="bg-blue-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-blue-800 mb-3">
          💙 Connection Game Answers
        </h2>
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <h3 className="font-semibold text-blue-900 mb-1">
              {q.label}
            </h3>
            <div className="bg-white rounded-2xl p-3 shadow-inner">
              {nonAdminMembers.map((voter) => {
                const ans = allAnswers.find(
                  (a) =>
                    a.user_id === voter.id &&
                    a.question_id === q.id
                );
                const target = members.find(
                  (m) => m.id === ans?.target_id
                );
                return (
                  <p
                    key={voter.id}
                    className="text-sm text-blue-900"
                  >
                    <strong>
                      {voter.display_name || voter.id}
                    </strong>{" "}
                    →{" "}
                    {target ? (
                      target.display_name || target.id
                    ) : (
                      <span className="text-gray-500">
                        No answer
                      </span>
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* WISHLISTS */}
      <section className="bg-green-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-green-800 mb-3">
          🎁 Wishlists Overview
        </h2>
        {nonAdminMembers.map((m) => {
          const w = allWishlists.filter(
            (x) => x.user_id === m.id
          );
          return (
            <div
              key={m.id}
              className="mb-3 bg-white rounded-2xl p-3 shadow-sm text-sm"
            >
              <p className="font-bold text-green-900 mb-1">
                {m.display_name || m.id} ({w.length} items)
              </p>
              {w.length === 0 ? (
                <p className="text-gray-500">
                  No items yet.
                </p>
              ) : (
                <ul className="list-disc ml-5 text-green-900">
                  {w.map((item) => (
                    <li key={item.id}>
                      {item.item}
                      {item.description
                        ? " — " + item.description
                        : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
