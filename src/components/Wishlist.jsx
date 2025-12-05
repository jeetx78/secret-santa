import { useState, useEffect } from "react";

export default function Wishlist() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("wishlist_items");
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);

  const saveWishlist = () =>
    localStorage.setItem("wishlist_items", JSON.stringify(items));

  useEffect(() => {
    saveWishlist();
  }, [items]);

  const handleAdd = () => {
    if (!title) return;
    const newItem = {
      id: Date.now(),
      title,
      note,
      image,
    };
    setItems([newItem, ...items]);
    setShowModal(false);
    setTitle("");
    setNote("");
    setImage(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter((x) => x.id !== id));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-sm bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition"
        >
          ➕ Add Wishlist Item
        </button>
      </div>

      {/* Polaroid Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-3 shadow-md border border-pink-100 flex flex-col items-center relative"
            style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
          >
            {item.image && (
              <img
                src={item.image}
                alt="wishlist"
                className="w-full h-48 object-cover rounded-xl shadow"
              />
            )}

            <h3 className="text-pink-500 font-semibold mt-3">{item.title}</h3>
            <p className="text-xs text-gray-500 text-center px-2">{item.note}</p>

            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 bg-red-400 text-white w-6 h-6 rounded-full text-xs shadow"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 space-y-3 border border-pink-200">
            <h2 className="text-lg font-semibold text-pink-500">
              Add Wishlist Item 🎁
            </h2>

            <input
              type="text"
              placeholder="Gift title"
              className="w-full border rounded-xl px-3 py-2 text-sm outline-pink-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Notes / description"
              className="w-full border rounded-xl px-3 py-2 text-sm outline-pink-300"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <input type="file" accept="image/*" onChange={onImageChange} />

            <button
              onClick={handleAdd}
              className="w-full py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition"
            >
              Add 🎀
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded-xl bg-gray-200 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
