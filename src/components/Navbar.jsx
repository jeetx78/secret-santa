// src/components/Navbar.jsx
import { useSanta } from "../context/SantaContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { currentUser, logout } = useSanta();
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-blue-200 shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      
      {/* Left - App name */}
      <h1
        onClick={() => navigate("/home")}
        className="text-2xl font-bold text-blue-700 cursor-pointer select-none"
      >
        Secret Santa 🎄
      </h1>

      <div className="flex items-center gap-4">

        {/* Theme button placeholder for later */}

        {/* Avatar */}
        {currentUser && (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300 shadow cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={currentUser.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Logout */}
        {currentUser && (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
