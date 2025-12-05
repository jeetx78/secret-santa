import { useParams, useNavigate } from "react-router-dom";
import { useSanta } from "../context/SantaContext";
import { useState, useEffect } from "react";

export default function UserWishlist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, members } = useSanta();
  const [wishlist, setWishlist] = useState([]);

  const member = members.find((m) => m.id === id);

  useEffect(() => {
    const saved = localStorage.getItem(`wishlist_${id}`);
    if (saved) setWishlist(JSON.parse(saved));
  }, [id]);

  const isOwner = currentUser.id === id;
  const isAdmin = currentUser.isAdmin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl mb-4"
      >
        ← Back
      </button>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-800">
          🎁 {member?.name}'s Wishlist
        </h1>
        {!wishlist.length && (
          <p className="mt-4 text-gray-600">No wishlist items added yet.</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {wishlist.map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-3xl shadow-xl border border-blue-100"
          >
            <div
              className="w-full h-48 rounded-xl overflow-hidden cursor-pointer mb-3"
              onClick={() => window.open(item.photo, "_blank")}
            >
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  🎁
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-blue-900">{item.name}</h2>
            <p className="text-gray-700 text-sm mt-1">{item.description}</p>

            <p className="text-sm text-blue-600 font-semibold mt-2">
              💸 {item.priceMin} - {item.priceMax}
            </p>

            {(isOwner || isAdmin) && (
              <button
                onClick={() =>
                  alert("Editing feature coming next release 🎄")
                }
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-xl text-sm"
              >
                Edit Item
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
