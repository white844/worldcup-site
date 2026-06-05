/**
 * UserContext — lightweight client-side user role state.
 *
 * Stores: { registered: bool, role: "buyer" | "seller" | null }
 * Persisted in localStorage under "ticketeer_user".
 * No backend — purely client-side for UI personalisation.
 *
 * Usage:
 *   const { user, register, logout } = useUser();
 *   register("buyer", name)  → mark user as registered buyer
 *   register("seller", name) → mark user as registered seller
 *   user.role === "buyer"    → hide Sell buttons
 *   user.role === "seller"   → show seller dashboard CTAs
 *   user.role === null       → guest
 */
import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "ticketeer_user";

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { registered: false, role: null, name: "" };
}

function saveUser(user) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const register = useCallback((role, name = "") => {
    const next = { registered: true, role, name };
    setUser(next);
    saveUser(next);
  }, []);

  const logout = useCallback(() => {
    const next = { registered: false, role: null, name: "" };
    setUser(next);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return (
    <UserContext.Provider value={{ user, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
