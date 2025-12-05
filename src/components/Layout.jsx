export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-white">
      {/* Soft snow layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60 snow-layer"></div>

      {/* Soft glowing lights border */}
      <div className="absolute inset-0 pointer-events-none lights-border"></div>

      {children}
    </div>
  );
}
