// src/context/SantaContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import membersData from "../data/members";

const SantaContext = createContext();

export function SantaProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  // Local static list
  const [members, setMembers] = useState(membersData);

  // Supabase tables
  const [allWishlists, setAllWishlists] = useState([]);
  const [allRoasts, setAllRoasts] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);

  // ───────── LOGIN SYSTEM ─────────
  const loginUser = async (accessCode, password) => {
    setAuthLoading(true);
    setError("");

    const memberIndex = members.findIndex(
      (m) =>
        m.accessCode?.trim().toLowerCase() === accessCode.trim().toLowerCase()
    );
    if (memberIndex === -1) {
      setError("Invalid access code");
      setAuthLoading(false);
      return false;
    }
    const member = members[memberIndex];

    if (!member.password || member.password === null || 
      (typeof member.password === "string" && member.password.trim() === "")
    ) {
      const { data, error: updateErr } = await supabase
        .from("users")
        .update({ password })
        .eq("accessCode", member.accessCode.trim())
      console.log("Password set result:", {data, updateErr});
        
      if (updateErr) {
        setError("Error setting password");
        setAuthLoading(false);
        return false;
      }
      // update local memory
      const updatedMembers = [...members];
      updatedMembers[memberIndex].password = password;
      setMembers(updatedMembers);
      
      const updatedUser = { ...member, password };
      setCurrentUser(updatedUser);
      setAuthLoading(false);
      return true;
    }
    // Regular login
    if (member.password !== password) {
      setError("Incorrect password");
      setAuthLoading(false);
      return false;
    }
    
    setCurrentUser(member);
    setAuthLoading(false);
    return true;
  };

  // ───────── LOGOUT ─────────
  const logout = () => {
    setCurrentUser(null);
    localStorage.clear();
  };

  // ───────── FETCHERS ─────────
  const fetchWishlists = async () => {
    const { data } = await supabase.from("wishlists").select("*");
    setAllWishlists(data || []);
  };

  const fetchRoasts = async () => {
    const { data } = await supabase.from("roasts").select("*");
    setAllRoasts(data || []);
  };

  const fetchAnswers = async () => {
    const { data } = await supabase.from("answers").select("*");
    setAllAnswers(data || []);
  };

  useEffect(() => {
    fetchWishlists();
    fetchRoasts();
    fetchAnswers();
  }, []);

  // ───────── REALTIME LISTENERS ─────────
  useEffect(() => {
    const channel = supabase
      .channel("live-updates")
      .on("postgres_changes", { schema: "public", table: "answers", event: "*" }, fetchAnswers)
      .on("postgres_changes", { schema: "public", table: "wishlists", event: "*" }, fetchWishlists)
      .on("postgres_changes", { schema: "public", table: "roasts", event: "*" }, fetchRoasts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ───────── SAVE HANDLERS ─────────
  const saveAnswer = async (user_id, question_id, target_id) => {
    return await supabase
      .from("answers")
      .upsert({ user_id, question_id, target_id }, { onConflict: "user_id,question_id" });
  };

  const saveRoast = async (from_id, to_id, message) => {
    return await supabase.from("roasts").insert({ from_id, to_id, message });
  };

  const saveWishlistItem = async (user_id, item, description) => {
    return await supabase.from("wishlists").insert({ user_id, item, description });
  };

  const deleteWishlistItem = async (id) => {
    return await supabase.from("wishlists").delete().eq("id", id);
  };

  return (
    <SantaContext.Provider
      value={{
        currentUser,
        loginUser,
        logout,
        authLoading,
        error,

        members,
        allWishlists,
        saveWishlistItem,
        deleteWishlistItem,
        allRoasts,
        saveRoast,
        allAnswers,
        saveAnswer,
        fetchAnswers,
      }}
    >
      {children}
    </SantaContext.Provider>
  );
}

export const useSanta = () => useContext(SantaContext);
