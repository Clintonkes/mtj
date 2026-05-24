import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Store token in memory only — NOT localStorage (XSS protection)
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);

  const login = useCallback(async (username, password) => {
    const data = await api.login(username, password);
    setToken(data.access_token);
    const me = await api.getMe(data.access_token);
    setAdmin(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) await api.logout(token);
    } catch (_) {}
    // Clear in-memory state
    setToken(null);
    setAdmin(null);
    // Full redirect to clear any cached state
    window.location.href = "/admin/login";
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
