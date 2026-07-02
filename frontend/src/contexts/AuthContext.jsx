import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);

  const check = useCallback(async () => {
    const token = localStorage.getItem("avani_admin_token");
    if (!token) {
      setAdmin(null);
      setReady(true);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setAdmin(data);
    } catch {
      localStorage.removeItem("avani_admin_token");
      setAdmin(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("avani_admin_token", data.access_token);
    setAdmin(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("avani_admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, ready, login, logout, refresh: check }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
