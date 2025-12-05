// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SantaProvider, useSanta } from "./context/SantaContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import UserWishlist from "./pages/UserWishlist";

import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { currentUser } = useSanta();
  return currentUser ? children : <Navigate to="/" />;
}

function Layout({ children }) {
  const { currentUser } = useSanta();
  return (
    <>
      {currentUser && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SantaProvider>
        <Routes>

          {/* LOGIN PAGE */}
          <Route path="/" element={<Login />} />

          {/* HOME PAGE */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Layout><Home /></Layout>
              </PrivateRoute>
            }
          />

          {/* PROFILE PAGE */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout><Profile /></Layout>
              </PrivateRoute>
            }
          />

          {/* ADMIN PAGE */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout><Admin /></Layout>
              </PrivateRoute>
            }
          />

          {/* VIEW OTHER USER WISHLIST PAGE */}
          <Route
            path="/wishlist/:id"
            element={
              <PrivateRoute>
                <Layout><UserWishlist /></Layout>
              </PrivateRoute>
            }
          />

          {/* DEFAULT CATCH */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </SantaProvider>
    </BrowserRouter>
  );
}
