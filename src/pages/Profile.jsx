import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useSanta } from "../context/SantaContext";

export default function Profile() {
    const {
        currentUser,
        members,
        allWishlists,
        saveWishlistItem,
        deleteWishlistItem,
        allRoasts,
        saveRoast,
        allAnswers,
        saveAnswer,
    } = useSanta();

    const [activeTab, setActiveTab] = useState("profile");
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [modalQuestionId, setModalQuestionId] = useState(null);
    const [roastText, setRoastText] = useState("");
    const [roastSent, setRoastSent] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemDesc, setNewItemDesc] = useState("");

    // Safety guards so we don't crash if context data is still loading
    const safeMembers = members || [];
    const safeWishlists = allWishlists || [];
    const safeRoasts = allRoasts || [];
    const safeAnswers = allAnswers || [];

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-blue-700">
                Please login first 🎄
            </div>
        );
    }

    // ───────── Derived data from context ─────────
    const userWishlist = safeWishlists.filter(
        (w) => String(w.user_id) === String(currentUser.id)
    );

    const santaReceiver = safeMembers.find(
        (m) => String(m.id) === String(currentUser.santa_for)
    );
    const roastReceiver = safeMembers.find(
        (m) => String(m.id) === String(currentUser.roast_target)
    );

    const receivedRoast =
        safeRoasts.find((r) => String(r.to_id) === String(currentUser.id))?.message || "";

    const otherProfiles = safeMembers.filter(
        (m) => m.id !== currentUser.id && !m.is_admin
    );

    // ───────── Wishlist Handlers ─────────
    const handleAddWishlistItem = async () => {
        if (!newItemName.trim()) return;
        await saveWishlistItem(
            currentUser.id,
            newItemName.trim(),
            newItemDesc.trim()
        );
        setNewItemName("");
        setNewItemDesc("");
    };

    const handleRemoveWishlistItem = async (id) => {
        await deleteWishlistItem(id);
    };

    // ───────── Roast Handlers (unchanged) ─────────
    const handleSendRoast = async () => {
        if (!roastReceiver) {
            alert("No roast target assigned yet.");
            return;
        }
        if (!roastText.trim()) {
            alert("Write something first 🔥");
            return;
        }
        await saveRoast(currentUser.id, roastReceiver.id, roastText.trim());
        setRoastSent(true);
        alert("Roast letter sent secretly 😈");
    };

    // ───────── Connection Questions & Badges ─────────
    const questions = [
        { id: "coffee", label: "☕ Who would you like to have coffee with?" },
        { id: "roadtrip", label: "🚗 Who would you go on a road trip with?" },
        { id: "ignore", label: "📵 Whose text would you ignore?" },
        { id: "trust", label: "🤝 Who do you trust the most?" },
        { id: "time", label: "⏳ Who do you want to spend more time with?" },
        { id: "crime", label: "🕵️ Who is your partner in crime?" },
        {
            id: "admire",
            label: "❤️ Who do you admire & love for their capabilities?",
        },
        { id: "fun", label: "🎉 Who is the most fun person?" },
    ];

    const badgeMeta = {
        coffee: { title: "Coffee Buddy", emoji: "☕" },
        roadtrip: { title: "Road Trip Star", emoji: "🚗" },
        ignore: { title: "Ghosted Most", emoji: "📵" },
        trust: { title: "Most Trusted", emoji: "🤝" },
        time: { title: "Most Wanted Time", emoji: "⏳" },
        crime: { title: "Partner-in-Crime Magnet", emoji: "🕵️" },
        admire: { title: "Most Admired", emoji: "❤️" },
        fun: { title: "Most Fun", emoji: "🎉" },
    };

    // ───────── Local overlay for answers (FIX) ─────────
    const [localAnswers, setLocalAnswers] = useState(safeAnswers);

    // keep localAnswers in sync when context updates
    useEffect(() => {
        setLocalAnswers(safeAnswers);
    }, [safeAnswers]);

    // lock only stored locally (no need in DB)
    const [votesLocked, setVotesLocked] = useState(
        () => typeof window !== "undefined"
            ? localStorage.getItem(`votesLocked_${currentUser.id}`) === "true"
            : false
    );

    const handleOpenQuestionModal = (questionId) => {
        if (votesLocked) return;
        setModalQuestionId(questionId);
    };

    const handleSaveVote = async (personId) => {
        console.log("FIRED", personId, modalQuestionId);
        if (!modalQuestionId) return;

        // save to backend
        await saveAnswer(currentUser.id, modalQuestionId, personId);

        // optimistic local update so UI responds instantly
        setLocalAnswers((prev) => {
            // remove any existing answer for this user+question
            const filtered = prev.filter(
                (a) =>
                    !(
                        String(a.user_id) === String(currentUser.id) &&
                        a.question_id === modalQuestionId
                    )
            );

            return [
                ...filtered,
                {
                    user_id: currentUser.id,
                    question_id: modalQuestionId,
                    target_id: personId,
                },
            ];
        });

        setModalQuestionId(null);
    };

    const handleLockVotes = () => {
        const allAnswered = questions.every((q) =>
            localAnswers.some(
                (a) =>
                    String(a.user_id) === String(currentUser.id) &&
                    a.question_id === q.id
            )
        );
        if (!allAnswered) {
            const ok = window.confirm(
                "You haven't answered all questions. Lock anyway?"
            );
            if (!ok) return;
        }
        localStorage.setItem(`votesLocked_${currentUser.id}`, "true");
        setVotesLocked(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // badge winners across entire group
    const computeBadgeWinners = () => {
        const results = [];

        questions.forEach((q) => {
            const counts = {};

            safeMembers.forEach((m) => {
                if (!m.is_admin) counts[String(m.id)] = 0;
            });

            localAnswers.forEach((a) => {
                if (
                    a.question_id === q.id &&
                    counts[String(a.target_id)] !== undefined
                ) {
                    counts[String(a.target_id)] += 1;
                }
            });

            const entries = Object.entries(counts);
            if (!entries.length) return;

            const [winnerId, maxVotes] = entries.sort(
                (a, b) => b[1] - a[1]
            )[0];

            if (maxVotes > 0) {
                const winnerMember = safeMembers.find(
                    (m) => String(m.id) === String(winnerId)
                );
                if (winnerMember) {
                    results.push({
                        questionId: q.id,
                        questionLabel: q.label,
                        winnerId,
                        winnerName: winnerMember.display_name,
                        votes: maxVotes,
                    });
                }
            }
        });

        return results;
    };

    const badgeWinners = computeBadgeWinners();
    const myBadges = badgeWinners.filter(
        (b) => String(b.winnerId) === String(currentUser.id)
    );

    // ───────── Tabs setup ─────────
    const tabs = [
        ["profile", "PROFILE"],
        ["wishlist", "WISHLIST"],
        ["mission", "MISSION"],
        ["roast", "ROAST"],
        ["connect", "CONNECTIONS"],
        ["others", "OTHERS"],
    ];
    if (currentUser.is_admin) tabs.push(["admin-results", "ADMIN RESULTS"]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 px-6 py-10 relative">
            {showConfetti && <Confetti numberOfPieces={260} recycle={false} />}

            {/* HEADER */}
            <div className="flex flex-col items-center text-center mb-8">
                <div
                    className="cursor-pointer"
                    onClick={() =>
                        currentUser.avatar && setAvatarPreview(currentUser.avatar)
                    }
                >
                    <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                        {currentUser.avatar ? (
                            <img
                                src={currentUser.avatar}
                                className="w-full h-full object-cover"
                                alt={currentUser.display_name}
                            />
                        ) : (
                            <span className="text-6xl">🎭</span>
                        )}
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-blue-900 mt-4">
                    {currentUser.display_name}
                </h1>
                <p className="text-blue-600">
                    {currentUser.is_admin ? "🎅 Admin" : "Participant"}
                </p>

                <div className="mt-4 text-sm text-blue-800 space-y-1">
                    {santaReceiver && (
                        <p>
                            🎁{" "}
                            <span className="font-semibold">Your Secret Santa target:</span>{" "}
                            {santaReceiver.display_name}
                        </p>
                    )}
                    {roastReceiver && (
                        <p>
                            🔥 <span className="font-semibold">Your Roast target:</span>{" "}
                            {roastReceiver.display_name}
                        </p>
                    )}
                </div>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {tabs.map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${activeTab === key
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 border-blue-400"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
                <div className="bg-white rounded-3xl p-6 shadow-xl max-w-2xl mx-auto text-center">
                    <p className="text-blue-900 text-lg font-semibold">
                        Welcome to your Secret Santa profile 🎄
                    </p>

                    {myBadges.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-blue-900 font-bold mb-2">
                                Your Connection Badges 🎖
                            </h3>
                            {myBadges.map((b) => {
                                const meta = badgeMeta[b.questionId] || {};
                                return (
                                    <p
                                        key={b.questionId}
                                        className="text-blue-800 text-sm font-semibold"
                                    >
                                        {meta.emoji || "🏅"} {meta.title || b.questionLabel}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "wishlist" && (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">
                        🎁 Your Wishlist
                    </h2>

                    <div className="space-y-2 mb-4">
                        <input
                            type="text"
                            placeholder="Gift item name"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="w-full border px-3 py-2 rounded-xl"
                        />
                        <textarea
                            placeholder="Optional description"
                            value={newItemDesc}
                            onChange={(e) => setNewItemDesc(e.target.value)}
                            className="w-full border px-3 py-2 rounded-xl"
                        />
                        <button
                            onClick={handleAddWishlistItem}
                            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold"
                        >
                            Add Item 🎄
                        </button>
                    </div>

                    {userWishlist.length ? (
                        <div className="space-y-3">
                            {userWishlist.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-blue-50 rounded-2xl p-4 shadow border flex justify-between items-start gap-4"
                                >
                                    <div>
                                        <h3 className="font-bold text-blue-900">{item.item}</h3>
                                        {item.description && (
                                            <p className="text-sm text-blue-800 mt-1">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveWishlistItem(item.id)}
                                        className="text-red-500 font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-500">
                            No wishlist items yet.
                        </p>
                    )}
                </div>
            )}

            {/* MISSION TAB */}
            {activeTab === "mission" && (
                <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">
                        🎄 Your Secret Santa Mission
                    </h2>
                    <p className="text-blue-700 text-lg font-semibold">
                        Target for gift: {santaReceiver?.display_name || "Not assigned"}
                    </p>
                    <p className="text-red-600 text-lg font-semibold mt-2">
                        Roast target: {roastReceiver?.display_name || "Not assigned"}
                    </p>

                    {receivedRoast && (
                        <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-xl shadow-inner text-left">
                            <p className="font-semibold mb-2">😈 Someone roasted you:</p>
                            <p className="italic whitespace-pre-wrap">"{receivedRoast}"</p>
                        </div>
                    )}
                </div>
            )}

            {/* ROAST TAB */}
            {activeTab === "roast" && (
                <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">
                        🔥 Roast Letter
                    </h2>
                    <p className="text-blue-700 mb-3">
                        You are roasting:{" "}
                        <span className="font-semibold">
                            {roastReceiver?.display_name || "Not assigned"}
                        </span>
                    </p>
                    <textarea
                        rows={6}
                        value={roastText}
                        onChange={(e) => setRoastText(e.target.value)}
                        className="w-full border border-blue-300 rounded-xl p-3 shadow-inner"
                        placeholder="Write something spicy but still friendly…"
                    />
                    <button
                        onClick={handleSendRoast}
                        disabled={roastSent}
                        className={`w-full mt-4 py-3 rounded-xl text-lg font-bold ${roastSent
                                ? "bg-gray-400 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                    >
                        {roastSent ? "Roast Sent ✔" : "Send Roast 🔥"}
                    </button>

                    {receivedRoast && (
                        <p className="mt-4 text-blue-700 text-sm font-semibold">
                            🔥 You received a roast anonymously!
                        </p>
                    )}
                </div>
            )}

            {/* CONNECTIONS TAB */}
            {activeTab === "connect" && (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                        💙 Connection Questions
                    </h2>

                    {questions.map((q) => {
                        const myAnswer = localAnswers.find(
                            (a) =>
                                String(a.user_id) === String(currentUser.id) &&
                                a.question_id === q.id
                        );
                        const selectedMember = safeMembers.find(
                            (m) => String(m.id) === String(myAnswer?.target_id)
                        );

                        return (
                            <div key={q.id} className="mb-5">
                                <p className="font-semibold text-blue-900 mb-2">{q.label}</p>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-sm text-blue-800 flex-1">
                                        {selectedMember
                                            ? `You chose: ${selectedMember.display_name}`
                                            : "No one selected yet"}
                                    </p>
                                    <button
                                        onClick={() => handleOpenQuestionModal(q.id)}
                                        className={`px-3 py-2 rounded-xl text-sm font-semibold ${votesLocked
                                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                : "bg-blue-600 text-white"
                                            }`}
                                    >
                                        {selectedMember ? "Change" : "Choose"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={handleLockVotes}
                        disabled={votesLocked}
                        className={`w-full mt-4 py-3 rounded-xl text-lg font-bold ${votesLocked
                                ? "bg-gray-400 text-white"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                    >
                        {votesLocked ? "Answers Locked ✔" : "Lock My Answers ✨"}
                    </button>

                    {badgeWinners.length > 0 && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">
                                🏆 Badge Holders
                            </h3>
                            {badgeWinners.map((b) => {
                                const meta = badgeMeta[b.questionId] || {};
                                return (
                                    <p
                                        key={b.questionId}
                                        className="text-blue-800 text-sm font-semibold"
                                    >
                                        {meta.emoji || "🏅"} {meta.title || b.questionLabel} →{" "}
                                        <span className="text-blue-600">{b.winnerName}</span>{" "}
                                        ({b.votes} votes)
                                    </p>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* OTHERS TAB */}
            {activeTab === "others" && (
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {otherProfiles.map((m) => {
                        const wishlist = safeWishlists.filter(
                            (w) => String(w.user_id) === String(m.id)
                        );

                        return (
                            <div
                                key={m.id}
                                className="bg-white rounded-3xl p-4 shadow-xl text-center"
                            >
                                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2">
                                    {m.avatar ? (
                                        <img
                                            src={m.avatar}
                                            className="w-full h-full object-cover"
                                            alt={m.display_name}
                                        />
                                    ) : (
                                        <span className="text-4xl">🎭</span>
                                    )}
                                </div>
                                <p className="font-bold text-blue-900 mb-1">
                                    {m.display_name}
                                </p>
                                <button
                                    onClick={() => {
                                        if (!wishlist.length) {
                                            alert(`${m.display_name} hasn’t added anything yet.`);
                                            return;
                                        }
                                        const text = wishlist
                                            .map(
                                                (i) =>
                                                    `• ${i.item}${i.description ? " — " + i.description : ""
                                                    }`
                                            )
                                            .join("\n");
                                        alert(`🎁 ${m.display_name}'s Wishlist:\n\n${text}`);
                                    }}
                                    className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
                                >
                                    View Wishlist
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ADMIN RESULTS TAB */}
            {activeTab === "admin-results" && currentUser.is_admin && (
                <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
                        🕵️ Admin View — All Votes
                    </h2>
                    {questions.map((q) => (
                        <div key={q.id} className="mb-6">
                            <h3 className="text-lg font-bold text-blue-800 mb-2">
                                {q.label}
                            </h3>
                            <div className="bg-blue-50 rounded-2xl p-4 shadow-inner">
                                {safeMembers
                                    .filter((m) => !m.is_admin)
                                    .map((voter) => {
                                        const ans = localAnswers.find(
                                            (a) =>
                                                String(a.user_id) === String(voter.id) &&
                                                a.question_id === q.id
                                        );
                                        const target = safeMembers.find(
                                            (x) => String(x.id) === String(ans?.target_id)
                                        );
                                        return (
                                            <p
                                                key={voter.id}
                                                className="text-blue-900 text-sm mb-1"
                                            >
                                                <strong>{voter.display_name}</strong> →{" "}
                                                {target?.display_name || (
                                                    <span className="text-gray-500">No answer</span>
                                                )}
                                            </p>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CONNECTION SELECTION MODAL */}
            {modalQuestionId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
                            Choose a person
                        </h3>
                        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                            {otherProfiles.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => handleSaveVote(m.id)}
                                    className="bg-blue-50 hover:bg-blue-100 rounded-2xl p-3 flex flex-col items-center"
                                >
                                    <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                                        {m.avatar ? (
                                            <img
                                                src={m.avatar}
                                                className="w-full h-full object-cover"
                                                alt={m.display_name}
                                            />
                                        ) : (
                                            <span className="text-3xl">🎭</span>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-blue-900">
                                        {m.display_name}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setModalQuestionId(null)}
                            className="mt-4 w-full py-2 rounded-xl bg-gray-300 text-gray-800 font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* AVATAR PREVIEW MODAL */}
            {avatarPreview && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
                    onClick={() => setAvatarPreview(null)}
                >
                    <img
                        src={avatarPreview}
                        className="max-w-[90%] max-h-[90%] rounded-3xl shadow-2xl"
                        alt="avatar preview"
                    />
                </div>
            )}
        </div>
    );
}
