import { useState, useEffect } from "react";
import { useSanta } from "../context/SantaContext";

export default function MessageWall() {
  const { currentUser } = useSanta();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("wall_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("wall_messages", JSON.stringify(messages));
  }, [messages]);

  const addMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      author: currentUser.name,
      text,
      likes: 0,
      ts: new Date().toLocaleString(),
    };

    setMessages([newMessage, ...messages]);
    setText("");
  };

  const likeMessage = (id) => {
    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, likes: m.likes + 1 } : m
      )
    );
  };

  return (
    <div>

      {/* Text area */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 px-4 py-2 border rounded-xl border-pink-200 bg-pink-50 outline-none"
          placeholder="Write a message 💌"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={addMessage}
          className="px-4 py-2 text-sm bg-pink-500 text-white rounded-xl shadow hover:bg-pink-600"
        >
          Send 💌
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white border border-pink-100 p-4 rounded-xl shadow-sm"
          >
            <div className="flex justify-between mb-1">
              <strong className="text-pink-500 text-sm">{msg.author}</strong>
              <span className="text-xs text-gray-500">{msg.ts}</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{msg.text}</p>

            <button
              onClick={() => likeMessage(msg.id)}
              className="text-xs bg-pink-200 text-pink-600 px-2 py-1 rounded-full"
            >
              ❤️ {msg.likes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
