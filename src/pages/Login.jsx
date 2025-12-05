// src/pages/Login.jsx
import { useState } from "react";
import { useSanta } from "../context/SantaContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginUser, authLoading, error } = useSanta();
  const navigate = useNavigate();

  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await loginUser(accessCode, password);
    if (ok) navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          🎅 Secret Santa Login
        </h1>

        <p className="text-sm text-blue-700 mb-6">
          Enter your <strong>Access Code</strong> and<br />
          set a <strong>new Password on first login</strong>.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Access Code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-blue-300"
          />

          <input
            type="password"
            placeholder="Password (new or existing)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-blue-300"
          />

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-2 hover:bg-blue-700 transition"
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-600 font-semibold mt-3">{error}</p>}
      </div>
    </div>
  );
}
